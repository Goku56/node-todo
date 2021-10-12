const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    comments:{
        type:String
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

const Comments = mongoose.model("Comments",commentSchema) 

module.exports = Comments