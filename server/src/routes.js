const UserController = require('./controllers/userController')
const UserAuthenController = require('./controllers/UserAuthenController')

module.exports = (app) => {
  /*RESTFUL API for users management*/
  //create user
  app.post('/user', UserController.create)
  // edit user, suspend, active
  app.put('/user/:userId', UserController.put)
  //detele user
  app.delete('/user/:userId', UserController.remove)
  //get user by id
  app.get('/user/:userId', UserController.show)
  //get all user
  app.get('/users', UserController.index)

  //login
  app.post('/login', UserAuthenController.login)

}