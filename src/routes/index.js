const usersRouter = require('./users.route')

function routes(app) {
  app.use('/user', usersRouter)
  app.get('/home', (req, res) => res.send('This home'))
  app.get('/', (req, res) => res.json({ state: 'success' }))

}

module.exports = routes
