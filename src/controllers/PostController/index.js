const helper = require('../../helper')
const postModel = require('../../models/post.model')
const {
  RESPONSE_STATUS,
  FOLDER_NAME,
  POST_ATTACHMENT,
  FILE_EXT,
  POST_ACTION,
  POST_STATUS
} = require('../../utils/constants')
const UserController = require('../UserController')

const handleSavedAndGetAttachments = (userID, attachments) => {
  const [relativeFilePaths, staticFilePaths, dirPath] = helper.getUploadFileAndFolderPath(
    __dirname,
    FOLDER_NAME.POSTS,
    userID,
    attachments
  )
  console.log('static paths: ', staticFilePaths)
  console.log('static dirPath: ', dirPath)
  console.log(
    'attachments: ',
    attachments.map(item => ({ length: item.source.length, type: item.type }))
  )
  helper.storeMultiFile(staticFilePaths, dirPath, attachments)
  return relativeFilePaths
}

const getUserPosts = async (userID, status) => {
  const posts = postModel.find({ userID: userID, status:status }).sort({createdAt: 'ascending'})
  return posts
}

class PostController {
  async handleGetPost(req, res) {
    const postID = req.params.id
    postModel
      .findById(postID)
      .then(data => {
        console.log('postData: ', data)
        res.status(200).json(data)
      })
      .catch(error => {
        console.log('error when get user posts: ')
        res.status(500).json({
          error
        })
      })
  }

  async handleGetUserPosts(req, res) {
    const userID = req.params.id
    const userData = await UserController.helper.getUserDataById(userID)
    const posts = await getUserPosts(userID, POST_STATUS.ACTIVE)
    if (userData && posts) {
      const customData = {
        code: RESPONSE_STATUS.SUCCESS,
        userID: userData._id,
        userName: userData.userName,
        userAvatar: userData.avatar,
        data: posts
      }
      res.status(200).json(customData)
    } else {
      console.log('error when get user posts: ')
      res.status(500).json({
        code: RESPONSE_STATUS.ERROR
      })
    }
  }

  handleStorePost(req, res) {
    const { userID, attachments, content } = req.body
    console.log(
      'attachment in store post: ',
      attachments.map(item => item.source.length)
    )
    const newAttachments = handleSavedAndGetAttachments(userID, attachments)
    const newPost = new postModel({
      userID,
      content,
      attachments: newAttachments
    })
    newPost
      .save()
      .then(result => {
        res.status(200).json(RESPONSE_STATUS.SUCCESS)
      })
      .catch(error => {
        console.log('Error when store post: ', error)
        res.status(500).json(RESPONSE_STATUS.ERROR)
      })
  }

  async handleEditPost(req, res) {
    const postID = req.params.id
    const data = req.body
    switch (data.action) {
      case POST_ACTION.UPDATE_CONTENT: {
        postModel
          .findByIdAndUpdate(postID, { content: data.content })
          .then(result => {
            res.status(200).json(RESPONSE_STATUS.SUCCESS)
          })
          .catch(error => {
            console.log('Error when update content post: ', error)
            res.status(500).json(RESPONSE_STATUS.ERROR)
          })
        break
      }
      case POST_ACTION.UPDATE_ATTACHMENT: {
        const newAttachments = handleSavedAndGetAttachments(data.userID, data.attachments)
        postModel
          .findByIdAndUpdate(postID, { attachments: newAttachments })
          .then(result => {
            res.status(200).json(RESPONSE_STATUS.SUCCESS)
          })
          .catch(error => {
            console.log('Error when update attachments post: ', error)
            res.status(500).json(RESPONSE_STATUS.ERROR)
          })
        break
      }
      case POST_ACTION.UPDATE_ALL: {
        const newAttachments = handleSavedAndGetAttachments(data.userID, data.attachments)
        postModel
          .findByIdAndUpdate(postID, { content: data.content, attachments: newAttachments })
          .then(result => {
            res.status(200).json(RESPONSE_STATUS.SUCCESS)
          })
          .catch(error => {
            console.log('Error when update content & attachments post: ', error)
            res.status(500).json(RESPONSE_STATUS.ERROR)
          })
        break
      }
      default: {
        console.log('Error when update content & attachments post: Invalid action')
        res.status(500).json(RESPONSE_STATUS.ERROR)
      }
    }
  }

  async handleTrashPost(req, res) {
    const postID = req.params.id
    console.log('post id: ', ' ', typeof postID, ' ' ,postID )
    postModel.findByIdAndUpdate(postID, {status: POST_STATUS.TRASH}).then(data => {
      res.status(200).json(RESPONSE_STATUS.SUCCESS)
    }).catch(error => {
      console.log('Error when trash post', error)
        res.status(500).json(RESPONSE_STATUS.ERROR)
    })
  }

  async handleDeletePost(req, res) {}

  async handleSharePost(req, res) {}
}

module.exports = new PostController()
