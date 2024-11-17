const helper = require('../../helper')
const postModel = require('../../models/post.model')
const { RESPONSE_STATUS, FOLDER_NAME } = require('../../utils/constants')
const UserController = require('../UserController')

const handleSavedAndGetAttachments = (userID, attachments) => {
  const [relativeFilePaths, staticFilePaths, dirPath] = helper.getUploadFileAndFolderPath(
    __dirname,
    FOLDER_NAME.POSTS,
    userID,
    attachments
  )
  helper.storeMultiFile(staticFilePaths, dirPath, attachments)
  return relativeFilePaths
}

const getUserPosts = async (userID) => {
  const posts = postModel.find({userID: userID})
  return posts
}

class PostController {
  async handleGetPost(req, res) {}

  async handleGetUserPosts(req, res) {
    const userID = req.params.id
    const userData = await UserController.helper.getUserDataById(userID)
    const posts = await getUserPosts(userID)
    if(userData && posts) {
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

  async handleEditPost(req, res) {}

  async handleDeletePost(req, res) {}

  async handleSharePost(req, res) {}
}

module.exports = new PostController()
