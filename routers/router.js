const routes = require('express').Router()
const { register, login, logout, forgetpassword, resetpassword } = require('../controllers/auth/authControllers')
const { me } = require("../controllers/auth/userControllers")
const { refresh } = require("../controllers/auth/refreshControllers")
const { create, update, destroy, index, show } = require("../controllers/postController")
const { category } = require("../controllers/categoryController")
const comments = require("../controllers/commentController")
const auth = require('../middlewares/auth')

routes.post('/register',register)
routes.post('/login',login)
routes.post('/forgetpassword',forgetpassword)
routes.post('/resetpassword/:resetToken',resetpassword)
routes.get('/me', auth, me)
routes.post('/logout',auth ,logout)
routes.get('/refresh', refresh)

routes.post("/category",auth, category)

routes.post('/post',auth, create)
routes.put('/post/:id',auth, update)
routes.delete('/post/:id',auth, destroy)
routes.get('/post/', index)
routes.get('/post/:id', show)

routes.post("/post/:id/comments/create", auth, comments.create)
routes.delete("/post/:comments_id/comments/delete", auth, comments.destroy)
routes.put("/post/:comments_id/comments/update", auth, comments.update)
routes.get("/post/comments", comments.index)


module.exports = routes

