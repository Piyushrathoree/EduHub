const mongoose = require("mongoose");


const adminSchema = new Schema({
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
        type:String, //cloudinary url
        required:true
    }
})
export const Admin = mongoose.model('Admin', adminSchema)