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
}