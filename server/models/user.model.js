import mongoose ,{Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique :true
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String, //cloudinary url
    },
});

// Add a static method for password comparison
userSchema.statics.isPasswordCorrect = async function (password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
};
const User = mongoose.model("User", userSchema);
export default User
