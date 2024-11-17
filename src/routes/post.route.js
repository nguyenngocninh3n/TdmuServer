const express = require('express')
const PostController = require('../controllers/PostController')
const postRouter = express.Router()

postRouter.get('/:id/', PostController.handleGetPost)
postRouter.get('/user/:id', PostController.handleGetUserPosts)
postRouter.put('/store/:id/edit', PostController.handleEditPost)
postRouter.delete('/store/:id/delete', PostController.handleEditPost)
postRouter.post('/store/:id/share', PostController.handleEditPost)
postRouter.post('/store', PostController.handleStorePost)

module.exports = postRouter
