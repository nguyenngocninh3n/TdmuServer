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
    return userModel.findByIdAndUpdate(userID, { active: true})
}
async function handleInActiveUser(userID) {
  return userModel.findByIdAndUpdate(userID, { active: false})
}

async function addUser(data) {
  console.log('addUser data: ', data)
  const convertData = convertDataToUser(data)
  const newUser = await userModel.create(convertData).then(newUser => {
    console.log('data added: ', newUser);
    return newUser
  }).catch(error => log({error}));
  return newUser
}

class userController {

  helper = {
    getUserDataById,
    handleActiveUser,
    handleInActiveUser

  }
  
  async getUser(req, res) {
    const idUser = req.params.id
    getUserDataById(idUser).then(data => {
      res.status(200).json(data)
    }).catch(error => res.status(500).json({error}))
  }
  async getAllUser(req, res) {
    userModel.find({}).then( data => {
      res.status(200).json(data)
    }).catch(error => res.status(500).json({error}))
  }

  // async createUser(req, res) {
  //   console.log(req.body)
  // }

  async createUser(req, res) {
    console.log('start create user')
    const userData = req.body
    let newUser = await  getUserDataById(userData._id)
    if(newUser) {
        console.log('get user: ', newUser)
        res.json(newUser)
    } else {
      newUser = await addUser(req.body)
      console.log('3', newUser)
      res.json(newUser)
    }
    
  }

  async activeUser(req, res) {
    const userID = req.params.id
    handleActiveUser(userID).then(data => {
      res.status(200).json({_id: userID, active: true})
    }).catch(error => {
      console.log('Lỗi khi active user: ', error)
      res.status(500).json({error})
    })
  }

  async inActiveUser(req, res) {
    const userID = req.params.id
    handleInActiveUser(userID).then(data => {
      res.status(200).json({_id: userID, active: false})
    }).catch(error => {
      console.log('Lỗi khi in active user: ', error)
      res.status(500).json({error})
    })
  }

  async conventionUserInfor(req, res) {
    const userID = req.params.id
    userModel.findById(userID).then(data => {
      if(data) {
       const {_id, userName, avatar, active, updatedAt} = data
       const customData = {_id, userName, avatar, active, updatedAt}
        res.json(customData) 
      }
      else {
        res.status(200).json(null)
      }
    }).catch(error => {
      console.log('Lỗi khi in get convention user infor: ', error)
      res.status(500).json({error})
    })
  }
  

 
}

module.exports = new userController()
