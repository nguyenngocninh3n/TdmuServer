const express = require('express')
const app = express()

//connect database
const database = require('./config/mongodb')
database.mongooseConnect()

//cor
const cors = require('cors')
app.use(cors())

//xử lý form post - send data in body
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
//**??? */
const bodyParser = require('body-parser')
// Middleware để phân tích dữ liệu JSON
app.use(bodyParser.json({limit: '50mb'}));


//static file
const path = require('path')
app.use(express.static(path.join(__dirname,"public")))
console.log('static path: ', __dirname)

// middleware for resfull api
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

//router
const routes =  require('./routes/')
const { HOST, PORT, TYPE_SCREEN } = require('./utils/constants')
routes(app)

//socket
const SocketServer = require('./socket')
const {createServer} = require('http')
const server = createServer(app)
SocketServer.runSocketServer(server)

//firebase cloud messaging
const admin = require('firebase-admin');
const serviceAccount = require('./config/server-account-key.json');
const fcmNotify = require('./notify')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

let count = 1
setInterval(()=> {
  count++
  const data = {
    channelID: '123',
    senderID: 'SvaAEothwpRCGdvECZoinGNumi12',
    senderName: 'ninh',
    senderAvatar: 'uploads/users/SvaAEothwpRCGdvECZoinGNumi12/image/0.6739125844.png',
    title: 'Tiêu đề' + count,
    body:'Đây là nội dung',
    channelType:'Bài viết',
    type: TYPE_SCREEN.PROFILE
  }
  fcmNotify.sendNotification(
    'fO6tAzfDTnmCTIa8xnvLNA:APA91bFhURsYBzxP2XshutbCrDyIA8HBr5Mvf3kkKBPlou8e-JzZ518ahpQhXKp_vjapVaDa8APCgw-jJ5iSQ3v8vNrtgYzrDhunIzuJmzTPG2TsDmrxaKs',
    'Tiêu đề' + count,
    'Đây là nội dung',
    data
  )
}, 30000)

server.listen(PORT, HOST,  () => {
  console.log(`Server is running on: http://${HOST}:${PORT}`)
})