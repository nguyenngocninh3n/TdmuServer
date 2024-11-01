const express = require('express')
const userController = require('../controllers/UserController')
const router = express.Router()

router.post('/create', userController.createUser)
// router.get('/:id', userController.getUser)
module.exports = router
