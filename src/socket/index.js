const {Server} = require("socket.io");
const ChatDataModel = require("../models/chatData.convention.model");
const userModel = require("../models/user.model");
const UserController = require("../controllers/UserController");
const conventionModel = require("../models/convention.model");
const ConventionController = require("../controllers/ConventionController");
const FriendController = require("../controllers/FriendController");

const runSocketServer = (server) => {
    const io = new Server(server)
    var conventions = []
    io.on('connection', (client) => {
        var userData = {_id: ''}

        client.on('connection', async data => {
            userData._id = data.data.userID
            await UserController.helper.handleActiveUser(userData._id)
            const conventionIDs = await ConventionController.helper.handleGetConventionIDs(userData._id).then(data => data.data)
            const friendIDs = await FriendController.helpers.handleGetListFriend(userData._id).then(data => data.data.map(item => 'friend_' + item._id))
            for (const item of conventionIDs) { await client.join(item)}
            for (const item of friendIDs) { await client.join(item)}
            client.in('friend_'+userData._id).emit('friendActive', {userID: userData._id, active: true, updatedAt: new Date()})

        })
        client.on('disconnect', (data) => {
            UserController.helper.handleInActiveUser(userData._id)
            io.in('friend_'+userData._id).emit('friendActive', {userID: userData._id, active: false, updatedAt: new Date()})
          });
          client.on('disconnection', (data) => {
            UserController.helper.handleInActiveUser(userData._id)
            io.in('friend_'+userData._id).emit('friendActive', {userID: userData._id, active: false, updatedAt: new Date()})
          });

        client.on('joinChatRoom', data => {
            client.join(data)
        })

        client.on('joinChatRooms', data => {
            console.log('joinChatRooms: ', data)
            data.forEach(item => client.join(item))
        })

        client.on('convention', value => {
            const {conventionID} = value
            console.log('valie in on convention at server: ', value)
            io.in(conventionID).emit('convention', value)
      
        })

        client.on('conventionStored', receivedData => {
            console.log('prepare emit convention: ')
            const {uids, data, conventionID} = receivedData;
            const orders = uids.filter(item => item !== data.senderID)
            client.to(orders).emit('conventionStored', conventionID )
        })
    

    })


}

const SocketServer =  {runSocketServer}
module.exports = SocketServer
