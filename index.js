const express = require('express')
const cors = require('cors')
const cookie = require('cookie-parser')
require ('dotenv').config()
const app = express()
const PORT = process.env.PORT || 4000
const db = require('./db/index.js')
const auth_router = require('./routes/auth_routes')
const user_router = require('./routes/user_routes.js')

//Middlewares
app.use(cookie())
app.use(express.json())
app.use(cors())  


//API Endpoints
app.use('/auth', auth_router)
app.use('/user', user_router)

app.listen(PORT, function(){
    console.log(`Server is running on ${PORT}`)
})