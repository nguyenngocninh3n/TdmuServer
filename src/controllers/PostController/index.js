const helper = require('../../helper')
const postModel = require('../../models/post.model')
const {
  RESPONSE_STATUS,
  FOLDER_NAME,
  POST_ATTACHMENT,
  FILE_EXT,
  POST_ACTION,
  POST_STATUS,
  SCOPE
} = require('../../utils/constants')
const { getStatusFriend } = require('../FriendController')
const friendHelper = require('../FriendController/friendHelper')
const UserController = require('../UserController')
const userHelper = require('../UserController/userHelper')
const { getNewFeedPosts } = require('./postMethod')

const handleSavedAndGetAttachments = (userID, attachments, custom) => {
  const [relativeFilePaths, staticFilePaths, dirPath] = helper.getUploadFileAndFolderPath(
    __dirname,
    custom ? custom + FOLDER_NAME.POSTS : FOLDER_NAME.POSTS,
    userID,
    attachments
  )
  helper.storeMultiFile(staticFilePaths, dirPath, attachments)
  return relativeFilePaths
}

const getUserPosts = async (userID, ownerID, status) => {
 
  const queyObj = {
    userID: userID,
    status: status
  }
  if (ownerID === userID) {
    const posts = await postModel.find(queyObj).sort({ createdAt: 'desc' })
    return posts
  } else {
    const friendStatus = await friendHelper.getFriendStatus(ownerID, userID)
    console.log('friend status: ', friendStatus)
    const scope = friendStatus === SCOPE.FRIEND
      ? [SCOPE.PUBLIC, SCOPE.FRIEND]
      : SCOPE.PUBLIC
      console.log('scope: ', scope)
    const posts = await postModel.find({ ...queyObj,  scope: {$in: scope} }).sort({ createdAt: 'desc' })
    return posts
  }
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

  async handleGetNewFeedPostsByUserID(req, res) {
    const {userID} = req.params
    console.log('into handleGetNewFeedPostsByUserID: ', userID) 
      const data = await getNewFeedPosts(userID)
      res.status(200).json(data)
    }

  async handleGetUserPosts(req, res) {
    const {userID, ownerID} = req.query
    console.log('query: ', req.query)
    console.log('userID vaf ownerID: ', userID, ' ', ownerID)
    console.log(1)
    const userData = await  userHelper.getUserDataById(userID)
    const posts = await getUserPosts(userID, ownerID, POST_STATUS.ACTIVE)
    console.log(2)
    if (userData && posts) {
      const customData = {
        code: RESPONSE_STATUS.SUCCESS,
        userID: userData._id,
        userName: userData.userName,
        userAvatar: userData.avatar,
        data: posts
      }
      console.log(3)
      res.status(200).json(customData)
    } else {
      console.log('error when get user posts: ')
      res.status(500).json({
        code: RESPONSE_STATUS.ERROR
      })
    }
  }

  handleStorePost(req, res) {
    const data = req.body
    console.log(
      'attachment in store post: ', data.scope
    )
    const newAttachments = handleSavedAndGetAttachments(data.userID, data.attachments, data.groupID ? 'groups/' + data.groupID.toString() +'/' : null)
    const newPost = new postModel({
     ...data,
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
    console.log('update post: ', req.body)
    const postID = req.params.id
    const data = req.body
    switch (data.action) {
      case POST_ACTION.UPDATE_CONTENT: {
        postModel
          .findByIdAndUpdate(postID, { content: data.content, scope: data.scope })
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
          .findByIdAndUpdate(postID, { attachments: newAttachments, scope: data.scope })
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
          .findByIdAndUpdate(postID, { content: data.content,scope: data.scope, attachments: newAttachments })
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

  async handleDeletePost(req, res) {
    const postID = req.params.id
    console.log('post id: ', ' ', typeof postID, ' ' ,postID )
    postModel.findByIdAndUpdate(postID, {status: POST_STATUS.DELETE}).then(data => {
      res.status(200).json(RESPONSE_STATUS.SUCCESS)
    }).catch(error => {
      console.log('Error when delete post', error)
        res.status(500).json(RESPONSE_STATUS.ERROR)
    })
  }

  async handleSharePost(req, res) {}
}

module.exports = new PostController()
