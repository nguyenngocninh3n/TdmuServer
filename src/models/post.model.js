const mongoose = require('mongoose')
const { SCOPE, POST_STATUS } = require('../utils/constants')
const Schema = mongoose.Schema

const postModal = new Schema(
  {
    childrenID: {type: mongoose.Types.ObjectId, default: null},
    userID: String,
    attachments: {type: Array, default: []},
    content: {type: String, default: ''},
    scope: {type: String, default: SCOPE.PUBLIC},
    status: {type: String, default: POST_STATUS.ACTIVE},
    sharesCount: {type: Number, default: null},
    reactionsCount: {type: Number, default: null},
    commentsCount: {type: Number, default: null}
  },
  { timestamps: true }
)

module.exports = mongoose.model('Post', postModal)
