import mongoose ,{Schema } from "mongoose";
import bcrypt from "bcrypt";
const adminSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique :true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String, //cloudinary url
       
    },
});
adminSchema.statics.isPasswordCorrect = async function (password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
};
const Admin = mongoose.model("Admin", adminSchema);
export default Admin
