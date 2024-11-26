const friendModel = require('../../models/friend.model')
const { FRIEND_STATUS, RESPONSE_STATUS } = require('../../utils/constants')
const UserController = require('../UserController')
const userHelper = require('../UserController/userHelper')

const helper = {
  createFriend: async ( ownerID, userID, status ) => {
    const userData = await UserController.helper.getUserDataById(userID)
    const newFriend = new friendModel({
      _id: ownerID,
      data: [
        {
          _id: userID,
          userName: userData.userName,
          avatar: userData.avatar,
          status: status
        }
      ]
    })
    return await newFriend.save()
  },

  initFriend: async (ownerID) => {
    const newFriend = new friendModel({
      _id: ownerID,
      data: []
    })
    return await newFriend.save()
  },

  addFriend: async (ownerID, userID, status ) => {
    console.log('userID: ', userID)
    const userData = await userHelper.getUserDataById(userID)
    console.log('userData: ', userData)
    const newData = {
      _id: userID,
      avatar: userData.avatar,
      userName: userData.userName,
      status
    }
    return await friendModel.findByIdAndUpdate(
      ownerID,
      {
        $push: {
          data: newData
        }
      },
      {
        returnDocument: 'after'
      }
    )
  },

  acceptFriend: async (ownerID, userID, status) => {
    friendModel.updateOne({_id: ownerID, "data._id": userID}, {
        $set: {
           "data.$.status": status         
        }
    }).then(data => console.log('accept friend successfully: ', data))
  },
  refuseFriend: async (ownerID, userID) => {
    friendModel.updateOne({_id: ownerID}, {
        $pull: {
            data: {
                _id: userID
            }
        }
    })
  },

  handleGetListFriend: async (userID) => {
    return await friendModel
      .findById(userID)
      .then(data => {
        if(data) {
          const customData = data.data.filter(item => item.status === FRIEND_STATUS.FRIEND)
           customData.sort((a, b) => {
            const itemA = a.userName.trim().split(' ')
            const itemB = b.userName.trim().split(' ')
            const result = itemA.at(itemA.length - 1).localeCompare(itemB.at(itemB.length - 1))
            return result
          })
          return {data: customData, status: RESPONSE_STATUS.SUCCESS}
        }
         else {
          return {data: [], status: RESPONSE_STATUS.SUCCESS}
         }
      }).catch(error => {
        console.log('error when get list friend: ', error)
        return {data: [], status: RESPONSE_STATUS.ERROR}
      })
  }
}
class FriendController {
  helpers = {
    ...helper
  }

  async getListFriend(req, res) {
    const userID = req.params.id
    console.log('inner getListFriend: ', 'data: ', req.params)
    await helper.handleGetListFriend(userID).then(data => {
      if(data.status === RESPONSE_STATUS.SUCCESS) {
        res.status(200).json(data)
      }
      else {
        res.status(500).json({ error })
      }
    })
  }

  getStatusFriend(req, res) {
    const  {ownerID, userID} = req.query
    console.log('inner getStatus friend: ', 'data: ', ownerID, ' u ', userID)
    friendModel.findById(ownerID).then(data => {
        const userData = data?.data.filter(item => item._id === userID)
        if(userData?.at(0)) {
            res.status(200).json({ownerID, userID, status: userData.at(0).status})
        } else {
            res.status(200).json({ownerID, userID, status: FRIEND_STATUS.NONE})
        }
    }).catch(error => {
        console.log('lỗi khi get status friend: ', error)
        res.status(500).json({error})
    })
  }

  async updateStatusFriend(req, res) {
    const {ownerID, userID, status} = req.query;
    console.log('inner getStatus friend: ', 'data: ', req.query)
    switch(status) {
        case FRIEND_STATUS.PENDING: {
            await helper.addFriend(ownerID, userID, FRIEND_STATUS.PENDING)
            await helper.addFriend(userID, ownerID, FRIEND_STATUS.ACCEPTING)
            res.status(200).json('send request successfully!')
            break
        }
        case FRIEND_STATUS.ACCEPTING: {
            await helper.acceptFriend(ownerID, userID, FRIEND_STATUS.FRIEND)
            await helper.acceptFriend(userID, ownerID, FRIEND_STATUS.FRIEND)
            res.status(200).json('accept request successfully!')
            break
        } case FRIEND_STATUS.REFUSING: {
            await helper.refuseFriend(ownerID, userID)
            await helper.refuseFriend(userID, ownerID)
            res.status(200).json('refuse request successfully!')
            break
        }
        default: {
            console.log('status in updatestatus friend invalid')
            res.status(500).json('status in updatestatus friend invalid')
        }
    }
  }
}

module.exports = new FriendController()
