//MONGODB Driver

// const { MongoClient } = require('mongodb')
// // const uri = 'mongodb+srv://socialapp:Dd5uekFtfmi95MgU@socialapp.wb6nr.mongodb.net/socialapp?retryWrites=true&w=majority&appName=SocialApp'
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri)
// async function connect() {
//   // Connect the client to the server	(optional starting in v4.7)
//   await client.connect().then(res => console.log('thành công: ', res))
//   // Send a ping to confirm a successful connection
//   await client.db('socialapp')
//   console.log('Pinged your deployment. You successfully connected to MongoDB!')
// }

const uri = "mongodb+srv://socialapp:uaGuO0pKFz0ugnNO@socialapp.wb6nr.mongodb.net/socialapp?retryWrites=true&w=majority&appName=SocialApp";


// Mongoose
const mongoose = require('mongoose')
async function mongooseConnect() {
  await mongoose.connect(uri, {autoIndex: true}).then(()=> console.log('success')).catch(error => console.log(error))
} 
module.exports = {mongooseConnect }
