let express = require('express')
let bodyParser = require('body-parser')
let cors = require('cors')
const { sequelize } = require('./models')
const app = express()
const config = require('./config/config')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

require('./routes')(app)

let port = process.env.PORT || config.port
sequelize.sync({ force: false }).then(() => {
  app.listen(port, () => {
    console.log(`server running on ${port}`)
  })
})

