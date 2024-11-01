const express = require('express')
const app = express()
//connect database
const database = require('./config/mongodb')
database.mongooseConnect()

//cor
const cors = require('cors')
app.use(cors())

//xử lý form post - send data in body
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//**??? */
const bodyParser = require('body-parser')
// Middleware để phân tích dữ liệu JSON
app.use(bodyParser.json());


// middleware for resfull api
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

//router
const routes =  require('./routes/')
const { HOST, PORT } = require('./utils/constants')
routes(app)

app.listen(PORT, HOST,  () => {
  console.log(`Server is running on: http://${HOST}:${PORT}`)
})