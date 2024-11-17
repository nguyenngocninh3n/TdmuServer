const express = require('express')
const userController = require('../controllers/UserController')
const router = express.Router()

router.post('/create', userController.createUser)
router.put('/active/:id', userController.activeUser)
router.put('/inactive/:id', userController.inActiveUser)
router.get('/conventionUserFriend/:id', userController.conventionUserInfor)
router.get('/all', userController.getAllUser)
router.get('/:id', userController.getUser)

module.exports = router
