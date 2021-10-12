const routes = require('express').Router()
const { register, login, logout, forgetpassword, resetpassword } = require('../controllers/auth/authControllers')
const { me } = require("../controllers/auth/userControllers")
const { refresh } = require("../controllers/auth/refreshControllers")
const auth = require('../middlewares/auth')

routes.post('/register',register)
routes.post('/login',login)
routes.post('/forgetpassword',forgetpassword)
routes.post('/resetpassword/:resetToken',resetpassword)
routes.get('/me', auth, me)
routes.post('/logout',auth ,logout)
routes.get('/refresh', refresh)


module.exports = routes

