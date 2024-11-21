import mongoose ,{Schema } from "mongoose";

const purchaseSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
    },
    purchaseDate: {
        type: Date,
        default: Date.now,
    },
});

export const Purchase = mongoose.model("Purchase", purchaseSchema);
