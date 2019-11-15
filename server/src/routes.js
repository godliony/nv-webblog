const UserController = require('./controllers/userController')
const UserAuthenController = require('./controllers/UserAuthenController')
const isAuthenController = require('./authen/isAuthenController')
const BlogController = require('./controllers/BlogController')
const CommentController = require('./controllers/CommentController')
let multer = require("multer")

module.exports = (app) => {
  let storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, "src/public/uploads")
    },
    filename: function (req, file, callback) {
      console.log(file)
      callback(null, file.originalname)
    }
  })
  let upload = multer({ storage: storage }).array("userPhoto", 10)
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
  app.get('/users',
    isAuthenController,
    UserController.index)

  //login
  app.post('/login', UserAuthenController.login)

  //blog route
  //create Blog
  app.post('/blog', BlogController.create)
  //edit blog,suspend,active
  app.put('/blog/:blogId', BlogController.put)
  //delete blog
  app.delete('/blog/:blogId', BlogController.remove)
  //get blog by id
  app.get('/blog/:blogId', BlogController.show)
  //get all blog
  app.get('/blogs', BlogController.index)

  //Comment route
  //create comment
  app.post('/comment', CommentController.create)
  //edit comment,suspend,active
  app.put('/comment/:commentId', CommentController.put)
  //delete
  app.delete('/comment/:commentId', CommentController.remove)
  //get comment by id
  app.get('/comment/:commentId', CommentController.show)
  //get all comment
  app.get('/comments', CommentController.index)

  app.post("/upload", function (req, res) {
    upload(req, res, function (err) {
      if (err) {
        console.log(err)
        return res.send("Error uploading file.")
      }
      res.end("File is uploaded")
    })
  })
  app.post('/upload/delete', async function (req, res) {
    try {
      const fs = require('fs')
      console.log(req.body.fileName)
      fs.unlink(`${process.cwd()}/src/public/uploads/${req.body.fileName}`, (err) => {
        if (err) throw err;
        res.send("Delete successful")
      })
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to delete file the material'
      })
      console.log(err)
    }
  })

}