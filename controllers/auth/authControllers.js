const User = require('../../models/User');
const Refresh = require('../../models/Refresh');
const ErrorResponse = require("../../utils/ErrorResponse")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const Joi = require('joi')
const crypto = require('crypto')
const sendEmail = require('../../utils/sendEmail');

exports.register = async (req,res,next) =>{
    const { username, email, password } = req.body

    const registerSchema = Joi.object({
        username:Joi.string().min(3).max(20).required(),
        email:Joi.string().email().required(),
        password:Joi.string().min(6).max(20).required()
    });

    const { error } = registerSchema.validate(req.body);
    
    if(error) {
        return next(error);
    }

    if(!username || !email ||!password){
        return next(ErrorResponse.allFieldRequired("all fields are required"))        
    }
    
    try{

        const isEmail = await User.exists({ email:email })

        if(isEmail){
            return next(ErrorResponse.alreadyExists("This email is already exists"))
        }
    
        const user = await User.create({
            username,
            email,
            password
        })

        const accessToken = jwt.sign({
            id:user._id,
            name:user.username,
            email:user.email
        },"process.env.JWT_SECRET",{expiresIn:'3d'})

        const message = `
        <h1>You just signUp to our site...</h1>
        <p>Hope you have a good expirence</p>
        <p>Send the feedback at www.abc.com</p>
        <h3>Thank You...</h3>
        `
        // try{
        //     await sendEmail({
        //         to:user.email,
        //         subject:"Welcome To Our Site",
        //         text:message
        //     })
        // }catch(err){
        //     next(err)
        // }

        res.status(200).json({
            success:true,
            data:"email sent",
            type:"Bearer",
            accessToken:accessToken,
        })

    }catch(err){
        next(err)
    }
}

exports.login = async (req,res,next) =>{
    const { email, password } = req.body

    const loginSchema = Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().min(6).max(20).required()
    });

    const { error } = loginSchema.validate(req.body);
    
    if(error) {
        return next(error);
    }

    if(!email || !password){
        return next(ErrorResponse.allFieldRequired('all fields are required'))
    }

    try{
        const user = await User.findOne({ email }).select("+password")
        
        if(!user){
            return next(ErrorResponse.unAuthorize())
        }

        await bcrypt.compare(password, user.password).then((isMatch)=>{
            if(!isMatch){
                return next(ErrorResponse.wrongCredentials())
            }

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

            Refresh.create({
                token:refreshToken
            })

            res.status(200).json({
                success:true,
                type:"Bearer",
                accessToken:accessToken,
                refreshToken:refreshToken
            })
        })
    }catch(err){
        next(err)
    }   
}

exports.logout = async (req,res,next)=>{
    const refreshSchema = Joi.object({
        refresh_token : Joi.string().required()
    })

    const { error } = refreshSchema.validate(req.body);

    if(error){
        return next(error);
    }

    try{
        await Refresh.deleteOne({token:req.body.refresh_token});
    }catch(err){
        return next(new Error("something went wrong in database"));
    }

    res.json({"logout":"userlogout"});
}

exports.forgetpassword = async (req,res,next) =>{
    const  { email } = req.body

    try{
        const user = await User.findOne({ email })
        if(!user){
            return next(ErrorResponse.message("Email could not be sent"))
        }

        const resetToken = user.getResetPasswordToken()
        
        await user.save()

        const resetUrl = `http://localhost:3000/api/auth/resetpassword/${resetToken}`

        const message = `
        <h1>You have requested for Password Reset...</h1>
        <p>Please click the below link to reset the password. Link will expire in 10 minutes</p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        <h3>Thank You...</h3>
        `
        try{
            await sendEmail({
                to:user.email,
                subject:"Password Reset Request",
                text:message
            })

            res.status(200).json({
                success:true,
                data:"email sent"
            })
        }catch(err){
            user.resetPasswordToken = undefined,
            user.resetPasswordExpire = undefined
            await user.save()
            return next(ErrorResponse.message('email could not be send'))
        }
    }catch(err){
        next(err)
    }
}

exports.resetpassword = async (req,res,next) =>{
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex')

    try{
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire:{$gt:Date.now()}
        })

        if(!user){
            return next(ErrorResponse.unAuthorize())
        }

        user.password = req.body.password
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save()

        res.status(200).json({
            success:true,
            data:"password reset successfull"
        })
    }catch(err){
        next(err)
    }
}




