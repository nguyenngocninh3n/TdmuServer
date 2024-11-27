const helper = require('../helper')
const groupModel = require('../models/group.model')
const postModel = require('../models/post.model')
const userModel = require('../models/user.model')
const { SCOPE, RESPONSE_STATUS } = require('../utils/constants')
const friendHelper = require('./FriendController/friendHelper')
const groupHelper = require('./GroupController/groupHelper')

class SearchController {
  async getSearchPost(req, res) {
    const { userID, queryString } = req.params
    console.log('into get search post: ', userID, ' ', queryString)

    const friendIDs = await friendHelper.getListFriendsID(userID).then(response => response.data)
    const groupIDs = await groupHelper
      .getGroupsByUserID(userID)
      .then(response => response.data.map(item => item._id))
    const allgroups = await groupHelper.getAllgroup()
    const publicGroup = allgroups.data
      .filter(item => item.scope === SCOPE.PUBLIC)
      .map(item => item._id)

    postModel
      .find({
        $and: [
          {
            $or: [
              {
                $or: [
                  {
                    scope: SCOPE.PUBLIC
                  },
                  {
                    userID: { $in: friendIDs },
                    scope: SCOPE.FRIEND
                  },
                  {
                    userID: userID,
                    scope: SCOPE.PRIVATE
                  }
                ]
              },
              {
                $or: [
                  {
                    userID: { $in: [...groupIDs, ...publicGroup] }
                  }
                ]
              }
            ]
          },
          { content: { $regex: queryString, $options: 'i' } }
        ]
      })
      .sort({ createdAt: 'desc' })
      .then(data => res.status(200).json({ status: RESPONSE_STATUS.SUCCESS, data: data }))
      .catch(error => {
        console.log('Error when get serch post')
        res.status(500).json({ status: RESPONSE_STATUS.ERROR, data: null })
      })
  }

  async getSearchUser(req, res) {
    const { userID, queryString } = req.params
    console.log('into get search user: ', userID, ' ', queryString)
    console.log('index: ', await userModel.listIndexes())
    // const response = userModel
    //   .find(
    //     { $text: { $search: queryString, $caseSensitive: false } },
    //     { score: { $meta: 'textScore' } }
    //   )
    //   .sort({ score: { $meta: 'textScore' } })

    userModel
      .find({ searchName: { $regex: queryString, $options: 'i' } })
      .then(data => res.status(200).json({ status: RESPONSE_STATUS.SUCCESS, data: data }))
      .catch(error => {
        console.log('Error when get serch user: ', error)
        res.status(500).json({ status: RESPONSE_STATUS.ERROR, data: null })
      })
  }

  async getSearchGroup(req, res) {
    const { userID, queryString } = req.params
    const customQuery = helper.removeVietnameseTones(queryString)
    groupModel
      .find({ $text: { $search: customQuery } }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .then(data => res.status(200).json({ status: RESPONSE_STATUS.SUCCESS, data: data }))
      .catch(error => {
        console.log('Error when get serch group: ', error)
        res.status(500).json({ status: RESPONSE_STATUS.ERROR, data: null })
      })
  }

  async getSearchImage(req, res) {}

  async getSearchVideo(req, res) {}
}

module.exports = new SearchController()
