import express from "express";
const app = express();
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import bcrypt from "bcrypt";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { z } from "zod";
//signup controller for user
const signup = async (req, res) => {
    // input validation using zod
    try {
        const userSchema = z.object({
            name: z.string(),
            email: z.string().email(),
            password: z
                .string()
                .min(8)
                .max(20)
                .regex(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$&])[A-Za-z\d@#$&]{8,}$/,
                    "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one of the special characters @, #, $, or &."
                ),
        });
        // Validate the request body
        const validatedUser = userSchema.parse(req.body);
    
        // If validation passes, proceed with further logic
        const { name, email, password } = validatedUser;
    
        console.log(email, password, name);
        // input validation overs here
    
        // check if the user already exist in database
        const existingUser = await User.findOne({ email });
        console.log(existingUser);
    
        if (existingUser) {
            throw new ApiError(400, "user already exist");
        }
    
        //hashing the password to store in the database
        const hashPassword = await bcrypt.hash(password, 10);
    
        console.log(hashPassword);
    
        // if user is new than storing it to database
        const user = await User.create({
            name,
            email,
            password: hashPassword,
        });
    
        console.log(user);
    
        //removing password from response
        const createdUser = await User.findById(user._id).select("-password");
    
        // response if the user is sign up successfully
        res.status(200).json(
            new ApiResponse(200, createdUser, " user signup successfully")
        );
    } catch (error) {
        console.log(error);
        res.status(500).json(new ApiResponse(500, null, "server error"));
    }
};

// signup controller ends here

//signin controller starts here
const signin = async (req, res) => {
    // input validation using zod
   try {
     const userSchema = z.object({
         email: z.string().email(),
         password: z
             .string()
             .min(8)
             .max(20)
             .regex(
                 /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$&])[A-Za-z\d@#$&]{8,}$/,
                 "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one of the special characters @, #, $, or &."
             ),
     });
 
     // Validate the request body
     const validatedUser = userSchema.parse(req.body);
 
     // getting data from client if it passes the checks or input validation
     const { email, password } = validatedUser;
 
     //check if the data is received
     if (!(email || password)) {
         throw new ApiError(400, " field shouldn't be empty ");
     }
 
     // find user in the database and check if the password is correct
     const user = await User.findOne({ email });
 
     if (!user) {
         throw new ApiError(404, "user not found , please sign in or retry");
     }
 
     const isPasswordValid = await User.isPasswordCorrect(
         password,
         user.password
     );
 
     //check for password
     if (!isPasswordValid) {
         throw new ApiError(401, " your password is wrong ");
     }
 
     const token = jwt.sign(email, process.env.USER_JWT_SECRET);
 
     //set the items in the req.headers
     req.headers.authorization = token;
 
     // response if the user is sign in successfully
     res.status(200).json(
         new ApiResponse(
             200,
             {
                 user,
                 token,
             },
             " sign-in successful"
         )
     );
   } catch (error) {
    console.log(error);
    res.status(error.status).ApiError(500 , error.message)
    
   }
};
//sign in controller ends here

//controller for get user courses
const userCourses = async (req, res) => {
    try {
        // get user from the from middleware
        const user = req.user;

        // get the user's courses from the database
        const courses = await Course.find({ userId: user._id });

        // return the courses
        res.status(200).json(courses);
    } catch (error) {
        console.log(error);
        res.status(500).json(new ApiResponse(500, null, "server error"));
    }
}
//exporting all the controllers for routing
export { signup, signin , userCourses};
