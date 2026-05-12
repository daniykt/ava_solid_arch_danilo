const mongoose = require('mongoose')
const Pet = require('../models/Pet')

module.exports = class PetController {
  static async create(req, res) {
    const { name, age, weight, color } = req.body

    if (!name) {
      return res.status(422).json({ message: 'O nome do pet é obrigatório.' })
    }
    if (!age) {
      return res.status(422).json({ message: 'A idade do pet é obrigatória.' })
    }
    if (!weight) {
      return res.status(422).json({ message: 'O peso do pet é obrigatório.' })
    }
    if (!color) {
      return res.status(422).json({ message: 'A cor do pet é obrigatória.' })
    }

    if (!req.files || req.files.length === 0) {
  return res.status(422).json({
    message: 'A imagem do pet é obrigatória.'
  })
  }

    const images = req.files ? req.files.map(file => file.filename) : []

    const owner = {
      _id: req.user.id,
      name: req.user.name
    }

    const pet = new Pet({
      name,
      age: Number(age),
      weight: Number(weight),
      color,
      images: images,
      available: true,
      user: owner
    })

    try {
      const newPet = await pet.save()
      return res.status(201).json({ message: 'Pet cadastrado com sucesso!', data: newPet })
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao salvar o pet.' })
    }
  }

  static async getAll(req, res) {
    const pets = await Pet.find().sort('-createdAt')
    return res.status(200).json(pets)
  }

  static async getAllUserPets(req, res) {
    const pets = await Pet.find({ 'user._id': req.user.id }).sort('-createdAt')
    return res.status(200).json(pets)
  }

  static async getAllUserAdoptions(req, res) {
    const pets = await Pet.find({ 'adopter._id': req.user.id }).sort('-createdAt')
    return res.status(200).json(pets)
  }

    static async getPetById(req, res) {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).json({ message: 'ID inválido.' })
    }

    const pet = await Pet.findById(id)
    if (!pet) {
      return res.status(404).json({ message: 'Pet não encontrado.' })
    }

    return res.status(200).json(pet)
  }

   static async removePetById(req, res) {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).json({ message: 'ID inválido.' })
    }

    const pet = await Pet.findById(id)
    if (!pet) {
      return res.status(404).json({ message: 'Pet não encontrado.' })
    }

    if (pet.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Ação não permitida para este usuário.' })
    }

    await Pet.findByIdAndDelete(id)
    return res.status(200).json({ message: 'Pet removido com sucesso.' })
  }

  static async updatePet(req, res) {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).json({ message: 'ID inválido.' })
    }

    const pet = await Pet.findById(id)
    if (!pet) {
      return res.status(404).json({ message: 'Pet não encontrado.' })
    }

    if (pet.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Ação não permitida para este usuário.' })
    }

    const { name, age, weight, color } = req.body
    const updatedData = {}

    if (name) updatedData.name = name
    if (age) updatedData.age = Number(age)
    if (weight) updatedData.weight = Number(weight)
    if (color) updatedData.color = color

    if (req.files && req.files.length > 0) {
      updatedData.images = req.files.map(file => file.filename)
    }

    await Pet.findByIdAndUpdate(id, updatedData)
    const updatedPet = await Pet.findById(id)
    return res.status(200).json({ message: 'Pet atualizado com sucesso!', data: updatedPet })
  }
    static async schedule(req, res) {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).json({ message: 'ID inválido.' })
    }

    const pet = await Pet.findById(id)
    if (!pet) {
      return res.status(404).json({ message: 'Pet não encontrado.' })
    }

    if (pet.user._id.toString() === req.user.id) {
      return res.status(422).json({ message: 'Você não pode agendar uma visita para o seu próprio pet.' })
    }

    pet.adopter = {
      _id: req.user.id,
      name: req.user.name
    }

    await pet.save()
    return res.status(200).json({ message: 'Visita agendada com sucesso!', data: pet })
  }

  static async concludeAdoption(req, res) {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(422).json({ message: 'ID inválido.' })
    }

    const pet = await Pet.findById(id)
    if (!pet) {
      return res.status(404).json({ message: 'Pet não encontrado.' })
    }

    if (pet.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Apenas o dono pode concluir a adoção.' })
    }

    pet.available = false
    await pet.save()
    return res.status(200).json({ message: 'Adoção concluída com sucesso!', data: pet })
  }
}