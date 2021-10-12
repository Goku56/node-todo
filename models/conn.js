const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB)
    .then(()=>{
        console.log('mongodb connected')
    }).catch((err)=>{
        console.log('mongodb error',err)
    })