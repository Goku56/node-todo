const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/node_git_jenkins')
    .then(()=>{
        console.log('mongodb connected')
    }).catch((err)=>{
        console.log('mongodb error',err)
    })
