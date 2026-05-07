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
      image: images,
      available: true,
      user: owner
    })

    try {
      const newPet = await pet.save()
      return res.status(201).json({
        message: 'Pet criado com sucesso!',
        pet: newPet
      })
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao salvar o pet.', error: error.message })
    }
  }
}

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
      image: images,
      available: true,
      user: owner
    })

    try {
      const newPet = await pet.save()
      return res.status(201).json({
        message: 'Pet criado com sucesso!',
        pet: newPet
      })
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao salvar o pet.', error: error.message })
    }
  }

  static async getAll(req, res) {
    const pets = await Pet.find().sort('-createdAt')
    return res.status(200).json(pets)
  }
}