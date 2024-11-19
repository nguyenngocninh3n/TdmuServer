const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userModel = new Schema({
  _id: {type: String},
  userName: { type: String },
  email: { type: String },
  phone: { type: String },
  avatar: { type: String },
  followerNum: { type: Number },
  followingNum: { type: Number },
  sex: { type: Boolean },
  age: { type: Number },
  active: {type: Boolean, default: true}
}, { timestamps: true })

module.exports = mongoose.model('User', userModel)
