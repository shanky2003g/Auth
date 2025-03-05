const express = require('express')
const get_user_data = require('../controllers/user_controllers.js')
const userauth_middleware = require('../middlewares/user_auth.js')


const router = express.Router()

router.get('/data',userauth_middleware, get_user_data)

module.exports = router
