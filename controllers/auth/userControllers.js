const User = require('../../models/User')
const ErrorResponse = require("../../utils/ErrorResponse")

exports.me = async(req,res,next)=>{
    try{
        const user = await User.findOne({ _id:req.user.id }).select("-password -__v -updatedAt");  
        if(!user){
            return next(ErrorResponse.message("Please Login to Continue..."));
        }
        res.json({
            success:true,
            data:user
        });
    }catch(err){
        return next(err)
    }
}