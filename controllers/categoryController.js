const Category = require('../models/Category');
const ErrorResponse = require("../utils/ErrorResponse")
const Joi = require('joi')

exports.category = async (req,res,next) =>{
    const { name } = req.body

    const categorySchema = Joi.object({
        name:Joi.string().min(3).max(30).required()
    });

    const { error } = categorySchema.validate(req.body);
    
    if(error) {
        return next(error);
    }

    if(!name){
        return next(ErrorResponse.allFieldRequired("all fields are required"))        
    }
    
    try{
    
        const category = await Category.create({
            name,
        })


        res.status(200).json({
            success:true,
            data:category
        })

    }catch(err){
        next(err)
    }
}
