const { ValidationError } = require("joi");
const ErrorResponse = require("../utils/ErrorResponse");

const errorHandler = (err,req,res,next) => {
    let statusCode = 500;
    let data = {
        message:"internal server error",
        ...( process.env.DEBUG_MODE === 'true' && {originalError: err.message})
    }

    if(err instanceof ValidationError){
        statusCode = 422,
        data = {
            message: err.message,
        }
    }

    if(err instanceof ErrorResponse){
        statusCode = 409,
        data = {
            message: err.message
        }
    }

    return res.status(statusCode).json({
        success:false,
        data:data
    });
}

module.exports = errorHandler;