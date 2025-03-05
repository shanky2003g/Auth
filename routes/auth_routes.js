const express = require('express')
const { register } = require('../controllers/auth')
const { login } = require('../controllers/auth')
const { logout } = require('../controllers/auth')
const {sendVerifyOtp} = require('../controllers/auth')
const {verifyEmail} = require('../controllers/auth')
const userauth_middleware = require('../middlewares/user_auth.js')
const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout) 
router.post('/send-verify_otp', userauth_middleware,sendVerifyOtp) 
router.post('/verify-account', userauth_middleware, verifyEmail ) 


module.exports = router