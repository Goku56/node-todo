const Post = require("../models/Post")
const Comments = require("../models/Comments")
const ErrorResponse = require('../utils/ErrorResponse')
const mongoose = require('mongoose')
const Joi = require('joi')

const comments = {

    create:async (req,res,next) =>{
        
        let postId = req.params.id
        if(!mongoose.Types.ObjectId.isValid(postId)){
            return next(ErrorResponse.message("invalid post id"))
        }
        Post.findOne({_id:postId}).then(async(post)=>{
            if(!post){
                return next(ErrorResponse.notFound("no blog found"))
        }

            const commentSchema = Joi.object({
                comments:Joi.string().min(3).max(30).required(),
                userId:Joi.string().min(3).max(30).required(),
            });
        
            const { error } =  commentSchema.validate(req.body);
            
            if(error) {
                return next(error);
            }

            let commentDoc = await Comments.create({
                comments:req.body.comments,
                postId:postId,
                userId:req.body.userId
            })

            const commentData = await commentDoc.save()
            
            await Post.updateOne(
                {_id:postId},
                { $push: { comments:commentData._id } }
            )
            
            return res.status(200).json({
                success:true,
                data:commentData
            }) 
        }
        ).catch((err)=>{
            return next(err.message)
        })
    },  
    
    update:async(req,res,next)=>{
        let comment_id = req.params.comments_id
        if(!mongoose.Types.ObjectId.isValid(comment_id)){
            return next(ErrorResponse.message("invalid post id"))
        }

        Comments.findOne({_id:comment_id}).then(async(comment)=>{
            if(!comment){
                return next(ErrorResponse.message("no comments found"))
            }

            
                const commentSchema = Joi.object({
                    comments:Joi.string().min(3).max(30).required(),
                    userId:Joi.string().min(3).max(30).required(),
                });
            
                const { error } =  commentSchema.validate(req.body);
                
                if(error) {
                    return next(error);
                }

                const updated = await Comments.updateOne(
                    {_id:comment_id},
                    { $set: {comments:req.body.comments} },
                    {new:true}
                )

                res.status(200).json({
                    success:true,
                    data:"comment updated"
                })
            
        }).catch((err)=>{
            return next(err)
        })
    },

    destroy:async(req,res,next)=>{
        const document = await Comments.findOneAndRemove({ _id:req.params.comments_id });
        if(!document){
            return next(new Error("nothing to delete"));
        }
    
        res.status(200).json({
            success:true,
            data:document
        });
    } 
}

module.exports = comments