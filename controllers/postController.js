const Joi = require('joi');
const Post = require("../models/Post")
const ErrorResponse = require('../utils/ErrorResponse');
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination:(req,file,cb)=>cb(null,"upload/"),
    filename:(req,file,cb)=>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}` 
        cb(null,uniqueName);
    }
});

const handleMultipartData = multer({ storage, limits:{fileSize:1000000 * 5} }).single('image');

exports.create = async (req,res,next)=>{
        handleMultipartData(req,res, async (err)=>{
            if(err){
                return next(ErrorResponse.serverError());
            }
            const filePath = req.file.path;
            
            const postValid = Joi.object({
                title:Joi.string().min(3).max(15).required(),
                description:Joi.string().min(5).max(25).required(),
                category:Joi.string().min(6).max(30).required(),
                created_by:Joi.string().min(6).max(30).required()
            });
            
            const { error } = postValid.validate(req.body);
            
            if(error){
                fs.unlink(`${appRoot}/${filePath}`,(err)=>{
                    if(err){
                        return next(ErrorResponse.serverError(err.message));
                    }
                })
                return next(error);
            }
            
            const {title, description, category, created_by } = req.body
            let document;
            try{
                document = await Post.create({
                    title,
                    description,
                    category,
                    created_by,
                    image:filePath
                }); 
            }catch(err){
                return next(err);
            }
            res.json({
                success:true,
                data:document
            });
        });
}

exports.update = async(req,res,next)=>{
    handleMultipartData(req,res,async (err)=>{
        
        if(err){
            return next(ErrorResponse.serverError());
        }
        
        let filePath;
        if(req.file){
            filePath = req.file.path;
        }
        const postValid = Joi.object({
            title:Joi.string().min(3).max(15).required(),
            description:Joi.string().min(5).max(25).required(),
            category:Joi.string().min(6).max(30).required(),
            created_by:Joi.string().min(6).max(30).required()
        });

        const { error } = postValid.validate(req.body);
        
        if(error){
            if(req.file){
                fs.unlink(`${appRoot}/${filePath}`,(err)=>{
                    if(err){
                        return next(ErrorResponse.serverError(err.message));
                    }
                })
                return next(error);
            }
        }

        const {title, description, category, created_by } = req.body
        let document;
        try{
            document = await Post.findOneAndUpdate({ _id:req.params.id},{
                title,
                description,
                category,
                created_by,
                ...(req.file && {image:filePath} ),
            },{new:true}); 
        }catch(err){
            return next(err);
        }
        res.json({
            success:true,
            data:document
        });
    });           
}

exports.destroy = async(req,res,next)=>{
    const document = await Post.findOneAndRemove({ _id:req.params.id });
    if(!document){
        return next(new Error("nothing to delete"));
    }

    const imagePath = document._doc.image;
    fs.unlink(`${appRoot}/${imagePath}`,(err)=>{
        if(err){
            return next(ErrorResponse.serverError());
        }
    });

    res.status(200).json({
        success:true,
        data:document
    });
}

exports.index = async(req,res,next)=>{
    let document;
    try{
     document = await Post.find().select('-updatedAt -__v');
    }catch(err){
        return next(ErrorResponse.serverError())
    }

    res.status(200).json({
        success:true,
        data:document
    });
}

exports.show = async(req,res,next)=>{
    let document;
    try{
        document = await Post.findOne({_id:req.params.id}).select('-updatedAt -__v');
        if(!document){
            return next(new Error("not found"));
        }
    }catch(err){
        return next(ErrorResponse.serverError());
    }
    res.status(200).json({
        success:true,
        data:document
    });
}
