let express = require('express')
let bodyParser = require('body-parser')
const { sequelize } = require('./models')
const app = express()
const config = require('./config/config')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

require('./routes')(app)

let port = process.env.PORT || config.port
sequelize.sync({ force: false }).then(() => {
  app.listen(port, () => {
    console.log(`server running on ${port}`)
  })
})

