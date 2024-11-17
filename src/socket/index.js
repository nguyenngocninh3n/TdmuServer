const {Server} = require("socket.io");
const ChatDataModel = require("../models/chatData.convention.model");
const userModel = require("../models/user.model");
const UserController = require("../controllers/UserController");

const runSocketServer = (server) => {
    const io = new Server(server)
    var conventions = []
    io.on('connection', (client) => {
        var userData = {_id: ''}

        client.on('connection', data => {
            userData._id = data.data.userID
            UserController.helper.handleActiveUser(userData._id)

        })
        client.on('disconnect', (data) => {
            UserController.helper.handleInActiveUser(userData._id)
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
