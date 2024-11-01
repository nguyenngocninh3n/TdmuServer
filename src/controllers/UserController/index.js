const { log } = require('../../helper')
const userModel = require('../../models/user.model')

const convertDataToUser = data => {
  const newUser = {
    _id: +data._id,
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

async function getUserData(uid) {
  return await userModel.findById(uid).then(data => data)
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

  async getUser(req, res) {
    const idUser = req.params.id
    console.log('1', 'req.body : ', req.body )
    let userData = await  getUserDataById(idUser)
    console.log('2', userData)
    if(!userData) {
      userData = await addUser(req.body)
      console.log('3', newUser)
    }
    res.json(userData)
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

  

 
}

module.exports = new userController()
