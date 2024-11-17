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
const { HOST, PORT } = require('./utils/constants')
routes(app)

//socket
const SocketServer = require('./socket')
const {createServer} = require('http')
const server = createServer(app)
SocketServer.runSocketServer(server)

server.listen(PORT, HOST,  () => {
  console.log(`Server is running on: http://${HOST}:${PORT}`)
})