const express = require('express')
const ResourceController = require('../controllers/ResourceController')
const resourceRouter = express.Router()

resourceRouter.get('/convention/:id', ResourceController.getConventionFiles)

module.exports = resourceRouter
