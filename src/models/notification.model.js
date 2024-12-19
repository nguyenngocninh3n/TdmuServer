const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NOTIFICATION_TYPE = {
    POST_REACTION: 'POST_REACTION',
    POST_COMMENT: '',
    POST_TAG: '',

    COMMENT_REACTION: '',
    COMMENT_REPLY: '',
    COMMENT_TAG: '',

    FRIEND_REQUEST: '',
    FRIEND_ACCEPT: '',

    GROUP_REQUEST: '',
    GROUP_ACCEPT: '',

}

const notificationModel = new Schema({
    _id: mongoose.Schema.ObjectId,
    targetID: mongoose.Types.ObjectId,
    type: String,
    message: String,
    number: Number,
    userID: String,
    avatar: String
}, {timestamps: true})