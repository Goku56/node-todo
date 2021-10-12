require('dotenv').config()
require('./models/conn')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const app = express()

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())
app.use(helmet())
app.use(morgan("common"))



//port
const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log(`server listening to port ${port}`)
})