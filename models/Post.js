const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true,
        unique:true
    },
    description: {
        type:String,
        required:true,
        unique:true
    },
    category: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    created_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comments"
    }],
    image: { type:String, required:true, get:(image)=>{
        console.log(`${image}`);
            return `http://localhost:3000/${image}`;
        }}
},{timestamps: true, toJSON:{getters:true} })

module.exports = mongoose.model("Post",postSchema,);