const jwt = require('jsonwebtoken')
const ErrorResponse = require('../utils/ErrorResponse')

function auth(req,res,next){
    let authHeader = req.headers.authorization
    if(authHeader){
        let token = authHeader.split(' ')[1]
        jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
            
            if(!user){
                return next(ErrorResponse.notFound("Token Expired, Please login to continue..."))
            }
            
            req.user = user
            next()
            
        })
    }else{
        return next(ErrorResponse.unAuthorize("Not Authorize to access this route"))
    }
}

module.exports = auth;
