const mongoose = require('mongoose')
const { MEMBER_ROLE, MEMBER_STATUS, MEMBER_CONVENTION_STATUS } = require('../utils/constants')
const Schema = mongoose.Schema

const MemberModel = new Schema({
    _id: {type: String},
    userName: {type: String},
    role: {type: String, default: ''},
    aka: {type: String, default: null},
    avatar: {type: String, default: null },
    status: {type:String, default: MEMBER_CONVENTION_STATUS.ACTIVE}
}, {timestamps: true})

module.exports = MemberModel
