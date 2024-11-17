const mongoose = require('mongoose')
const { MEMBER_ROLE } = require('../utils/constants')
const Schema = mongoose.Schema

const MemberModel = new Schema({
    _id: {type: String},
    userName: {type: String},
    role: {type: String, default: ''},
    aka: {type: String, default: null},
    avatar: {type: String, default: null }
}, {timestamps: true})

module.exports = MemberModel
