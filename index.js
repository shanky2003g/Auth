const express = require('express')
const cors = require('cors')
const cookie = require('cookie-parser')
const cookieParser = require('cookie-parser')
require ('dotenv').config()
const app = express()
const PORT = process.env.PORT || 4000
const db = require('./db/index.js')

//Middlewares
app.use(express.json())
app.use(cors)  
app.use(cookieParser)



app.listen(PORT, function(){
    console.log(`Server is running on ${PORT}`)
})