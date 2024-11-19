 const mongoose = require("mongoose");

 const purchaseSchema = new Schema({
     user: {
         type: Schema.Types.ObjectId,
         ref: "User"
     },
     course: {
         type: Schema.Types.ObjectId,
         ref: "Course"
     },
     purchaseDate: {
         type: Date,
         default: Date.now
     }

 })

 export const Purchase = mongoose.model('Purchase', purchaseSchema)