const mongoose = require('mongoose')
const { SCOPE } = require('../utils/constants')
const Schema = mongoose.Schema

const postModal = new Schema(
  {
    childrenID: {type: mongoose.Types.ObjectId, default: null},
    userID: String,
    attachments: Array,
    content: String,
    scope: {type: String, default: SCOPE.PUBLIC},
    sharesCount: {type: Number, default: null},
    reactionsCount: {type: Number, default: null},
    commentsCount: {type: Number, default: null}
  },
  { timestamps: true }
)

module.exports = mongoose.model('Post', postModal)
