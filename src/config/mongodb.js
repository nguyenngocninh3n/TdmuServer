//MONGODB Driver

const { MongoClient } = require('mongodb')
const uri = 'mongodb+srv://socialapp:Dd5uekFtfmi95MgU@socialapp.wb6nr.mongodb.net/socialapp?retryWrites=true&w=majority&appName=SocialApp'
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri)
async function connect() {
  // Connect the client to the server	(optional starting in v4.7)
  await client.connect().then(res => console.log('thành công: ', res))
  // Send a ping to confirm a successful connection
  await client.db('socialapp')
  console.log('Pinged your deployment. You successfully connected to MongoDB!')
}

// Mongoose
const mongoose = require('mongoose')
const { log } = require('../helper')
async function mongooseConnect() {
  await mongoose.connect(uri).then(()=> console.log('success')).catch(error => log(error))
} 
module.exports = {mongooseConnect }
