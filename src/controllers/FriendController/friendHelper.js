const friendModel = require('../../models/friend.model')
const { FRIEND_STATUS, RESPONSE_STATUS } = require('../../utils/constants')

const getFriendStatus = async (ownerID, userID) => {
  const data = await friendModel.findById(ownerID).then(data => {
    const customData =  data.data.find(item => item._id === userID)
    console.log('friend data: ', data)
    return customData?.status ?? FRIEND_STATUS.NONE
  }).catch(error => {
    console.log('errror get friend status at friendHelp: ', error)
    return null
  })
  return data
}

const getListFriendsID = async (userID) => {
  const response = await friendModel.findById(userID).then(data => {
    const customData = {_id: data._id, data: data.data.filter(item => item.status === FRIEND_STATUS.FRIEND)}
    return {status: RESPONSE_STATUS.SUCCESS, data: customData}
  }).catch(error => {
    console.log('errror get list friends id in friendHelper: ', error)
    return {status: RESPONSE_STATUS.ERROR, data: null}
  })
  return response

}

const friendHelper = {
  getFriendStatus,
  getListFriendsID
}

module.exports = friendHelper
