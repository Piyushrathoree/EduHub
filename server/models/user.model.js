const mongoose = require("mongoose");


const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:Number,
        required:true
    },
    avatar:{
        type:String //cloudinary url
    }
})
export const User = mongoose.model('User', userSchema)