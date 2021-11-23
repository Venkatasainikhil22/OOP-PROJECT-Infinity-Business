const mongoose = require('mongoose');
const tokenSchema = new mongoose.Schema(
    {
        userid:{
            type: String,
            // ref: "user",
            required: true,
        },
        otp:{
            type:String,
            require:true
        }
    }
);
const OTP = mongoose.model('OTP',tokenSchema);
module.exports = OTP;