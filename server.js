require('dotenv').config()
require('./models/conn')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')
const errorHandler = require('./middlewares/errorHandler')
const app = express()


//middlewares
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())
app.use(helmet())
app.use(morgan("common"))
global.appRoot = path.resolve(__dirname);


//routes
app.use('/api/auth', require('./routers/router'))

//ErrorHandler (should be the last middleware)
app.use(errorHandler);


//port
const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log(`server listening to port ${port}`)
})