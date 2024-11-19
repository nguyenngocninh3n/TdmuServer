const { log } = require('../../helper')
const userModel = require('../../models/user.model')
const convertDataToUser = data => {
  const newUser = {
    _id: data._id,
    userName: data.name,
    email: data.email,
    phone: null,
    avatar: data.picture,
    followerNum: 0,
    followingNum: 0,
    sex: null,
    age: null
  }
  return new userModel(newUser)
}

async function getUserDataById(uid) {
  return await userModel.findById(uid)
}

async function handleActiveUser(userID) {
  return userModel.findByIdAndUpdate(userID, { active: true })
}
async function handleInActiveUser(userID) {
  return userModel.findByIdAndUpdate(userID, { active: false })
}

async function addUser(data) {
  const convertData = convertDataToUser(data)
  const newUser = await userModel
    .create(convertData)
    .then(newUser => {
      return newUser
    })
    .catch(error => log({ error }))
  return newUser
}

const userHelper = {
  getUserDataById,
  handleActiveUser,
  handleInActiveUser
}

module.exports = userHelper
