class ErrorResponse extends Error {
    constructor(status, msg){
        super();
        this.status = status,
        this.message = msg
    }

    static message(message){
        return new ErrorResponse(400,message);
    }

    static allFieldRequired(message){
        return new ErrorResponse(400,message);
    }

    static alreadyExists(message){
        return new ErrorResponse(409,message);
    }

    static wrongCredentials(message = "username or password is invalid"){
        return new ErrorResponse(401,message);
    }

    static unAuthorize(message = "unauthorize"){
        return new ErrorResponse(401,message);
    }

    static notFound(message = "404 Not Found"){
        return new ErrorResponse(404,message);
    }

    static serverError(message = "Internal Server Error"){
        return new ErrorResponse(500,message);
    }
}

module.exports = ErrorResponse;