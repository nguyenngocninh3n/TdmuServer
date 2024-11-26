const commentModel = require('../../models/comment.model')
const { RESPONSE_STATUS } = require('../../utils/constants')

class CommentController {
  async handleGetComments(req, res) {
    const postID = req.params.postID
    commentModel
      .find({ postID: postID })
      .sort({ createdAt: 'asc' })
      .then(data => {
     
        res.status(200).json(data)

      })
      .catch(error => {
        console.log('Error when get post comments: ', error)
        res.status(500).json(RESPONSE_STATUS.ERROR)
      })
  }

  async handleStoreComment(req, res) {
    const newComment = req.body
    commentModel
      .create(newComment)
      .then(data => {
        res.status(200).json(data)
      })
      .catch(error => {
        console.log('Error when store comment: ', error)
        res.status(500).json(RESPONSE_STATUS.ERROR)
      })
  }

  async handleUpdateComment(req, res) {
    const commentID = req.params.id
    console.log('update comment: ', commentID, ' ', req.body.value)
    commentModel
      .findByIdAndUpdate(commentID, { content: req.body.value })
      .then(data => {
        res.status(200).json(RESPONSE_STATUS.SUCCESS)
      })
      .catch(error => {
        console.log('Error when edit comment: ', error)
        res.status(500).json(RESPONSE_STATUS.ERROR)
      })
  }

  async handleDeleteComment(req, res) {
    const commentID = req.params.id
    commentModel
      .findByIdAndDelete(commentID)
      .then(data => {
        res.status(200).json(RESPONSE_STATUS.SUCCESS)
      })
      .catch(error => {
        console.log('Error when delete comment: ', error)
        res.status(500).json(RESPONSE_STATUS.ERROR)
      })
  }

  async handleReactComment(req, res) {
    const commentID = req.params.id
    const userID = req.body.userID
    commentModel
      .findById(commentID)
      .then(data => {
        const reactions = data.reactions
        const newReactions = reactions.filter(item => item !== userID)
        const isExist = newReactions.length < reactions.length
        if (isExist) {
          commentModel.findByIdAndUpdate(commentID,{ reactions: newReactions }, {returnDocument:'after'}).then(data => console.log(data))

        } else {
          commentModel.findByIdAndUpdate(commentID,{ reactions: [ ...reactions, userID] }, {returnDocument:'after'}).then(data => console.log(data))
        }
        res.status(200).json({status: RESPONSE_STATUS.SUCCESS, data: !isExist})
      })
      .catch(error => {
        console.log('Error when react comment: ', error)
        res.status(500).json({status: RESPONSE_STATUS.ERROR, data: 'ERROR'})
      })
  }
}

module.exports = new CommentController()
