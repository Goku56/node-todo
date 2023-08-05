const jwt = require("jsonwebtoken");
const Joi = require('joi')
const Refresh = require("../../models/Refresh");
const User = require("../../models/User");
const ErrorResponse = require("../../utils/ErrorResponse");

exports.refresh = async (req,res,next) =>{
        const refreshSchema = Joi.object({
            refresh_token : Joi.string().required()
        })

        const { error } = refreshSchema.validate(req.body);

        if(error){
            return next(error);
        }

        let refreshtoken;
        try{
            refreshtoken = await Refresh.findOne({ token:req.body.refresh_token });
            
            if(!refreshtoken){
                return next(ErrorResponse.unAuthorize('invalid token'));
            }
            let userId;
            try{
                const _id = await jwt.verify(refreshtoken.token,process.env.JWT_REFRESH);
                userId = _id;
            }catch(err){
                return next(ErrorResponse.unAuthorize('invalid token'));
            }
    
            const user = await User.findOne({_id:userId.id});
            if(!user){
                return next(ErrorResponse.notFound("user not found"));
            }

            //token
            const accessToken = jwt.sign({
                id:user._id,
                name:user.username,
                email:user.email
            },process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})
    
            const refreshToken = jwt.sign({
                id:user._id,
                name:user.username,
                email:user.email
            },process.env.JWT_REFRESH,{expiresIn:process.env.JWT_REFRESH_EXP})

            await Refresh.create({
                token:refreshToken
            })

            res.status(200).json({ 
                success:true,
                accessToken:accessToken,
                refreshToken:refreshToken 
            });   
        }catch(err){
            return next(new Error("something went wrong: "+err.message));
        }
}

