const express = require('express')
const FriendController = require('../controllers/FriendController')
const friendRouter = express.Router()

friendRouter.get('/list/:id', FriendController.getListFriend)
friendRouter.get('/status', FriendController.getStatusFriend)
friendRouter.post('/status/update', FriendController.updateStatusFriend)
module.exports = friendRouter
