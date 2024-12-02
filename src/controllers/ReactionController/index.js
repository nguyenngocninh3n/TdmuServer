const postModel = require('../../models/post.model')
const reactionModel = require('../../models/reaction.model')
const fcmNotify = require('../../notify/fcmNotify')
const { RESPONSE_STATUS, REACTION_TYPE, TYPE_SCREEN } = require('../../utils/constants')
const userHelper = require('../UserController/userHelper')

class ReactionController {
  async getReactionsByTargetID(req, res) {
    const { targetID } = req.params
    reactionModel
      .findOne({ targetID })
      .then(data => {
        res.status(200).json(data)
      })
      .catch(error => {
        console.log('Error when get reactions by target id: ', error)
        res.status(200).json(RESPONSE_STATUS.ERROR)
      })
  }

  async getReactionOfUserByTargetID(req, res) {
    const { targetID, userID } = req.params
    reactionModel
      .findOne({ targetID, userID })
      .then(data => {
        res.status(200).json(data)
      })
      .catch(error => {
        console.log('Error when get reaction of user by target id: ', error)
        res.status(500).json(RESPONSE_STATUS.ERROR)
      })
  }

  async updateReactionOfUserByTargetID(req, res) {
    const { targetID, userID, userName, avatar, status } = req.body
    const type = req.body?.type ?? REACTION_TYPE.POST
    console.log('into update reaction: ', req.body)
    reactionModel
      .findOne({ targetID, userID })
      .then(data => {
        if (data) {
          const status = data.status
          data
            .updateOne({ status: !status }, { returnDocument: 'before' })
            .then(data => {
                res.status(200).json({ ...data, status: !status })
                if (type === REACTION_TYPE.POST && !status) {
                    postModel.findById(targetID).then(response => {
                      if (response.userID !== userID) {
                        userHelper.getUserDataById(response.userID).then( userInfo => {
                            const data = fcmNotify.createNotifyData({
                                channelID: targetID + 'REACTION',
                                senderID: userID,
                                senderName: userName,
                                senderAvatar: avatar,
                                body: `${userName} đã thích bài viết của bạn`,
                                title: 'Một lượt thích mới!',
                                type: TYPE_SCREEN.POST
                              })
                              fcmNotify.sendNotification(userInfo.fcmToken, data)
                        })
                      }
                    })
                  }
        })
        } else {
          console.log('not having: create')
          reactionModel
            .create({
              targetID,
              userID,
              userName,
              avatar,
              status: true,
              type: type ?? REACTION_TYPE.POST
            })
            .then(data => {
              res.status(200).json(data)
              if (data.type === REACTION_TYPE.POST) {
                postModel.findById(targetID).then(response => {
                    if (response.userID !== userID) {
                        userHelper.getUserDataById(response.userID).then( userInfo => {
                            const data = fcmNotify.createNotifyData({
                                channelID: targetID + 'REACTION',
                                senderID: userID,
                                senderName: userName,
                                senderAvatar: avatar,
                                body: `${userName} đã thích bài viết của bạn`,
                                title: 'Một lượt thích mới!',
                                type: TYPE_SCREEN.POST
                              })
                              fcmNotify.sendNotification(userInfo.fcmToken, data)
                        })
                      }
                })
              }
            })
        }
      })
      .catch(error => {
        console.log('Error when update reaction of user by target id: ', error)
        res.status(200).json(RESPONSE_STATUS.ERROR)
      })
  }
}

module.exports = new ReactionController()