const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const crypto = require('crypto')


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, 'Please enter user name']
    },
    email:{
        type:String,
        required:[true, 'Please enter a email'],
        unique:true,
        match:[
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please enter a valid email'
        ]
    },
    password:{
        type:String,
        required:[true,'Please enter a password'],
        minlength:6,
        select:false
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
    next()
})

userSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString('hex')
    
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    this.resetPasswordExpire = Date.now() + 10 * (60*1000)
    return resetToken;
}


const User = mongoose.model('User',userSchema)

module.exports = User;