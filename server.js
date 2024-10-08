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

//health check route
app.use('/health-check', (req,res)=>{
    res.send("App is Healthy and running..;)")
})

//testing 
// app.use()

//routes
app.use('/ap4 41i/auth', require('./routers/router'))

//ErrorHandler (should be the last middleware)
app.use(errorHandler);


//port
const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log(`server listening to port ${port}`)
})
