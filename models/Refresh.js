const mongoose = require("mongoose");

const refreshSchema = new mongoose.Schema({
    token: {
        type:String,
        unique:true,
    }
})

module.exports = mongoose.model("Refresh",refreshSchema);