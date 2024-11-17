const usersRouter = require('./users.route')
const conventionsRouter = require('./conventions.route')
const friendRouter = require('./friend.route')
const resourceRouter = require('./resource.route')
const postRouter = require('./post.route')

function routes(app) {
  app.use('/convention', conventionsRouter)
  app.use('/user', usersRouter)
  app.use('/friend', friendRouter )
  app.use('/resource', resourceRouter)
  app.use('/post', postRouter)
  app.get('/home', (req, res) => res.send('This home'))
  app.get('/', (req, res) => res.json({ state: 'success' }))

}

module.exports = routes
