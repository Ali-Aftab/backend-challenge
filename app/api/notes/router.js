const controller = require('./controller')
const auth = require('./auth')
const validator = require('./validator')

module.exports = (router) => {
  router.post('/note', async (req, res) => {
    await auth.requiresLogin(req)
    await validator.create(req)
    await controller.create(req, res)
  })

  router.get('/user/:id/notes', async (req, res) => {
    await auth.requiresCurrentUser(req)
    await controller.find(req, res)
  })
}
