const express = require('express')
const PostController = require('../controllers/PostController')
const postRouter = express.Router()

postRouter.get('/:id/', PostController.handleGetPost)
postRouter.get('/user/:id', PostController.handleGetUserPosts)
postRouter.put('/:id/edit', PostController.handleEditPost)
postRouter.put('/:id/trash', PostController.handleTrashPost)
postRouter.delete('/:id/delete', PostController.handleEditPost)
postRouter.post('/:id/share', PostController.handleEditPost)
postRouter.post('/store', PostController.handleStorePost)

module.exports = postRouter
