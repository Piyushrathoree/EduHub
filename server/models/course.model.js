const mongoose = require("mongoose");


const courseSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        
    },
    price:{
        type:Number,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "Admin"
    }

})
export const Course = mongoose.model('Course', courseSchema)