const mongoose = require('mongoose')
const { SCOPE } = require('../utils/constants')
const Schema = mongoose.Schema

const groupModel = new Schema({
    name: {type: String},
    avatar: {type: String, default: null},
    bio: {type:String, default: null},
    scope: {type: String, default: SCOPE.PUBLIC},
    memberLength: {type: Number, default: 0},

}, {timestamps:true})

module.exports = mongoose.model('Group', groupModel)