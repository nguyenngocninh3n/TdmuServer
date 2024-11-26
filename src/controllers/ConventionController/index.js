const conventionModel = require('../../models/convention.model')
const UserController = require('../UserController')
const path = require('path')
const fs = require('fs')
const { type } = require('os')
const {
  MESSAGE_TYPE,
  MESSAGE_NOTIFY_TYPE,
  MESSAGE_ACTION,
  RESPONSE_STATUS
} = require('../../utils/constants')
const { error } = require('console')

const handleConventionChange = () => {
  conventionModel.watch().on('change', data => {
  })
}

const handleStoreTextMessage = ({ conventionID, data, res }) => {
  conventionModel
    .findByIdAndUpdate(
      conventionID,
      {
        $push: { data: { ...data } }
      },
      {
        returnDocument: 'after'
      }
    )
    .then(newData => {
      res.json(newData.data.at(-1))
    })
    .catch(error => {
      console.log('error when store text message: ', error)
      res.json({ error })
    })
}

const handleStoreUploadFileMessage = ({ conventionID, data, res }) => {
  conventionModel
    .findByIdAndUpdate(
      conventionID,
      {
        $push: { data: { senderID: data.senderID, type: data.type, message: data.message } }
      },
      {
        returnDocument: 'after'
      }
    )
    .then(newData => {
      const {senderID, _id, userName, type, message, createdAt, updatedAt} = newData.data.at(-1)
      res.status(200).json({senderID, _id, userName, message, createdAt, updatedAt, type, notify: data?.notify})
    })
    .catch(error => {
      console.log('error when store notify message: ', error)
      res.json({ error })
    })
}

const handleUpdateAvatarConvention = ({ conventionID, path }) => {
  conventionModel
    .findByIdAndUpdate(conventionID, {
      avatar: path
    })
    .then(newData => {
    })
    .catch(error => {
      console.log('error when update avatar convention: ', error)
    })
}

const handleUpdateNickName = ({ conventionID, userID, newState }) => {
  conventionModel
    .updateOne(
      { _id: conventionID, 'members._id': userID },
      {
        $set: {
          'members.$.aka': newState
        }
      }
    )
    .then(value => console.log('update biệt danh thành công'))
    .catch(error => {
      console.log('error when update avatar convention: ', error)
    })
}

const handleGetConventionIDs = async ownerID => {
  return await conventionModel
    .find({ uids: ownerID })
    .then(data => {
      if (data) {
        const uids = data.map(item => item._id.toString())
        const customData = { data: uids, status: RESPONSE_STATUS.SUCCESS }
        return customData
      } else {
        const customData = { data: [], status: RESPONSE_STATUS.SUCCESS }
        return customData
      }
    })
    .catch(error => {
      console.log('error get convention ids: ', error)
      return { data: [], status: RESPONSE_STATUS.ERROR }
    })
}

class ConventionController {
  helper = {
    handleGetConventionIDs
  }

  createConventionHistory = async (ownerID, userID) => {
    const ownerData = await UserController.helper.getUserDataById(ownerID)
    const userData = await UserController.helper.getUserDataById(userID)
    const newConvention = new conventionModel({
      avatar
    })
    conventionModel.create()
  }

  getConventionID(req, res) {
    const { ownerID, userID } = req.query

    conventionModel
      .findOne({ $or: [{ uids: [userID, ownerID] }, { uids: [ownerID, userID] }] })
      .then(data => {
        if (data) res.json(data._id)
        else res.json(null)
      })
      .catch(error => {
        console.log('error get convention id: ', error)
        res.status(500).json({ error })
      })
  }

  async getConventionIDs(req, res) {
    const { ownerID } = req.query
    await handleGetConventionIDs(ownerID).then(data => {
      if (data.status === RESPONSE_STATUS.SUCCESS) {
        res.status(200).json(data.data)
      } else {
        res.status(500).json('error')
      }
    })
  }

  getConventionByID = (req, res) => {
    const _id = req.params.id
    if (_id !== 'null') {
      conventionModel
        .findById(_id)
        .then(data => {
          console.log('get convention successfully')
          res.json(data)
        })
        .catch(error => {
          console.log('error when get convention by id: ', error)
          res.status(500).json({ error })
        })
    } else {
      res.status(200).json(null)
    }
  }

  getConvention = () => {}

  getConventions = (req, res) => {
    const { id } = req.params
    conventionModel
      .find({ uids: id })
      .sort({'updatedAt':'desc'})
      .then(data => {
        res.json(data)
      })
      .catch(error => {
        console.log('error when get conventions: ', error)
        res.status(500).json({ error })
      })
  }

  storeGroupConvention = async (req, res) => {
    const data = req.body
    conventionModel.create({
      uids: data.uids,
      members: data.members,
      data: [data.message],
      type: data.type,
      name: 'Chat nhóm'
    }).then(data => {
      res.status(200).json(RESPONSE_STATUS.SUCCESS)
    }) .catch(error => {
      console.log('error when store group convention: ', error)
      res.status(500).json({ error })
    })
  }

  storeConvention = async (req, res) => {
    /* req.body: {
        senderID,
        userID,
        message,
        type
    }*/
    const { senderID, userID, message, type } = req.body
    const senderPromise = UserController.helper.getUserDataById(senderID)
    const userPromise = UserController.helper.getUserDataById(userID)
    Promise.all([senderPromise, userPromise]).then(data => {
      const [senderData, userData] = data
      const newConvention = new conventionModel({
        avatar: '',
        name: '',
        uids: [senderID, userID],
        members: [
          {
            _id: senderID,
            aka: null,
            userName: senderData.userName,
            avatar: senderData.avatar
          },
          {
            _id: userID,
            aka: null,
            userName: userData.userName,
            avatar: userData.avatar
          }
        ],
        data: [
          {
            senderID,
            message,
            type
          }
        ]
      })
      newConvention
        .save()
        .then(data => {
          res.json(data)
        })
        .catch(error => {
          console.log(error)
          res.status(500).json({ error })
        })
    })
  }

  handleWriteFile = (dirPath, filePath, fileData) => {
    fs.mkdir(dirPath, { recursive: true }, err => {
      if (err) {
        console.error('Lỗi khi tạo thư mục:', err.message)
        return
      }

      // Lưu file vào đường dẫn đã tạo
      fs.writeFileSync(filePath, fileData, err => {
        if (err) {
          console.error('Lỗi khi lưu file:', err.message)
        } else {
          console.log('File đã được lưu thành công tại:', filePath)
        }
      })
    })
  }

  updateMessage = async (req, res) => {
    const { conventionID, messageID } = req.params
    const { type, message } = req.body.data
    switch (type) {
      case MESSAGE_ACTION.EDIT:
      case MESSAGE_ACTION.REMOVE: {
        conventionModel
          .updateOne(
            { _id: conventionID, 'data._id': messageID },
            {
              $set: {
                'data.$.message': message
              }
            }
          )
          .then(data => {
            console.log('update message successfully: ')
            res.status(200).json(RESPONSE_STATUS.SUCCESS)
          })
          .catch(error => {
            console.log('error when update message: ', error)
            res.status(500).json({ error })
          })
        break
      }
      case MESSAGE_ACTION.DELETE: {
        conventionModel
          .updateOne(
            { _id: conventionID },
            {
              $pull: { data: { _id: messageID } }
            },
            {}
          )
          .then(data => {
            console.log('delete message successfully: ')
            res.status(200).json(RESPONSE_STATUS.SUCCESS)
          })
          .catch(error => {
            console.log('error when delete message: ', error)
            res.status(500).json({ error })
          })
        break
      }
      default: {
        console.log('update action failure: ')
        res.status(500).json(RESPONSE_STATUS.ERROR)
      }
    }
  }

  storeMessage = async (req, res) => {
    const data = req.body
    const { senderID, message } = data
    const conventionID = req.params.id
    if (data.type === MESSAGE_TYPE.TEXT) {
      handleStoreTextMessage({ conventionID, data, res })
    } else if (
      data.type === MESSAGE_TYPE.NOTIFY &&
      data?.notify?.type === MESSAGE_NOTIFY_TYPE.CHANGE_AKA
    ) {
      const customData = {
        senderID: data.senderID,
        type: data.type,
        message: data.customMessage
      }
      const { userID, newState } = req.body
      handleUpdateNickName({ conventionID, userID, newState })
      handleStoreTextMessage({ conventionID, data: customData, res })
    }
    else if (
      data.type === MESSAGE_TYPE.NOTIFY &&
      data?.notify?.type === MESSAGE_NOTIFY_TYPE.CHANGE_CONVENTION_NAME
    ) {
      const customData = {
        senderID: data.senderID,
        type: data.type,
        message: data.customMessage
      }
      const { userID, newState } = req.body
      conventionModel.findByIdAndUpdate(conventionID,{name: data.notify.value}).then(data => console.log('data after upload name convention: ', data))
      handleStoreTextMessage({ conventionID, data: customData, res })
    }
    else {
      const imagePath = []
      let fileNameType = ''
      let pathFolderType = ''
      switch (data.type) {
        case MESSAGE_TYPE.IMAGE:
          fileNameType = '.png'
          pathFolderType = 'image'
          break
        case MESSAGE_TYPE.VIDEO:
          fileNameType = '.mp4'
          pathFolderType = 'video'
          break
        case MESSAGE_TYPE.NOTIFY:
          fileNameType = '.png'
          pathFolderType = 'image'
          break
        default:
          fileNameType = '.png'
          pathFolderType = 'image'
          break
      }
      for (const item of message) {
        const fileName = Math.random().toFixed(10) + fileNameType
        const relativePath = `uploads/conventions/${conventionID}/${pathFolderType}/`
        const dirPath = path.join(__dirname, '../../public/' + relativePath)
        const uploadPath = dirPath + fileName
        imagePath.push(relativePath + fileName)

        // Xóa header Base64 (nếu có) và chuyển đổi thành Buffer
        const fileBuffer = Buffer.from(item, 'base64') // Chuyển base64 thành buffer

        // Lưu file bằng fs.writeFile
        this.handleWriteFile(dirPath, uploadPath, fileBuffer)
      }
      if (data.type === MESSAGE_TYPE.NOTIFY) {
        const customData = {
          senderID: data.senderID,
          type: data.type,
          message: data.customMessage,
          notify: {
            type: MESSAGE_NOTIFY_TYPE.CHANGE_AVATAR,
            value: imagePath.at(0)
          },
        }
        handleUpdateAvatarConvention({ conventionID, path: imagePath.at(0) })
        handleStoreUploadFileMessage({ conventionID, data: customData, res })
      } else {
        const customData = {
          senderID: data.senderID,
          type: data.type,
          message: imagePath.toString()
        }
        handleStoreUploadFileMessage({ conventionID, data: customData, res })
      }
    }
  }
}
// handleConventionChange()
module.exports = new ConventionController()
