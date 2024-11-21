import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import Course from "../models/course.model.js";
import bcrypt from "bcrypt";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { z } from "zod";
//signup controller for admin
const signup = async (req, res) => {
    // input validation using zod
    const adminSchema = z.object({
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
    const validatedadmin = adminSchema.parse(req.body);

    // If validation passes, proceed with further logic
    const { name, email, password } = validatedadmin;

    console.log(email, password, name);

    // input validation overs here

    // check if the admin already exist in database
    const existingAdmin = await Admin.findOne({ email });
    console.log(existingAdmin);

    if (existingAdmin) {
        throw new ApiError(404, "Admin not found , please sign in or retry");
    }

    //hashing the password to store in the database
    const hashPassword = await bcrypt.hash(password, 10);

    console.log(hashPassword);

    // if admin is new than storing it to database
    const admin = await Admin.create({
        name,
        email,
        password: hashPassword,
    });
    console.log(admin);

    //removing password from response
    const createdAdmin = await Admin.findById(admin._id).select("-password");

    // response if the admin is sign up successfully
    res.status(200).json(
        new ApiResponse(200, createdAdmin, " admin signup successfully")
    );
};
// signup controller ends here

//signin controller starts here
const signin = async (req, res) => {
    // input validation using zod
    const adminSchema = z.object({
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
    const validatedAdmin = adminSchema.parse(req.body);

    // getting data from client if it passes the checks or input validation
    const { email, password } = validatedAdmin;

    console.log(email, password);

    //check if the data is received
    if (!(email || password)) {
        throw new ApiError(400, " field shouldn't be empty ");
    }

    // find admin in the database and check if the password is correct
    const admin = await Admin.findOne({ email });

    if (!admin) {
        throw new ApiError(404, "admin not found , please sign in or retry");
    }
    const isPasswordCorrect = await Admin.isPasswordCorrect(
        password,
        admin.password
    );

    //check for password
    if (!isPasswordCorrect) {
        throw new ApiError(401, " your password is wrong ");
    }
    const createdAdmin = await Admin.findById(admin._id).select("-password");
    const token = jwt.sign(email, process.env.ADMIN_JWT_SECRET);

    //set the items in the req.headers
    req.headers.authorization = token;

    res.status(200).json(
        new ApiResponse(200, { createdAdmin, token }, " sign-in successful ")
    );
};
//sign in controller ends here

// create course controller
const createCourse = async (req, res) => {
    // input validation using zod
    const courseSchema = z.object({
        title: z.string().min(5).max(50),
        description: z.string().min(10).max(500),
        price: z.number().positive(),
        thumbnail: z.string(),
        strictObject: true,
    });

    // Validate the request body
    const validatedCourse = courseSchema.parse(req.body);

    // getting data from client if it passes the checks or input validation
    const { title, description, price, thumbnail } = validatedCourse;

    console.log(title, description, price, thumbnail);

    //check if the data is received
    if (!(title || description || price || thumbnail)) {
        throw new ApiError(400, " field shouldn't be empty ");
    }

    // create a new course
    const newCourse = await Course.create({
        title,
        description,
        price,
        thumbnail,
        creatorId: req.user._id,
    });

    res.status(201).json(
        new ApiResponse(201, newCourse, " course created successfully")
    );
};
// create course controller ends here

//update course controller added here 
const updateCourse = async (req, res) => {
    // input validation using zod
    const courseSchema = z.object({
        title: z.string().min(5).max(50),
        description: z.string().min(10).max(500),
        price: z.number().positive(),
        thumbnail: z.string(),
    });

    // Validate the request body
    const validatedCourse = courseSchema.parse(req.body);

    // getting data from client if it passes the checks or input validation
    const { title, description, price, thumbnail } = validatedCourse;
    const { courseId } = req.params;

    console.log(title, description, price, thumbnail, courseId);

    //check if the data is received
    if (!(title || description || price || thumbnail || courseId)) {
        throw new ApiError(400, " field shouldn't be empty ");
    }

    // find course in the database and update it
    const updatedCourse = await Course.updateOne(
        {
            _id: courseId,
            creatorId: req.user._id,
        },
        {
            title,
            description,
            thumbnail,
            price,
        }
    );
    console.log(updatedCourse);
    if (!updatedCourse) {
        throw new ApiError(400, " course not updated ");
    }

    res.status(200).json(
        new ApiResponse(200, updatedCourse, "course updated successfully")
    );
};
//update course controller added here

//delete course controller here
const deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    //check if the course id is not available
    if (!courseId) {
        throw new ApiError(404, " course id not found ");
    }
    const deletedCourse = await Course.findOneAndDelete({
        _id: courseId,
        creatorId: req.user._id,
    });

    console.log(deleteCourse);

    res.status(200).json(
        new ApiResponse(200, deletedCourse, " course deleted successfully")
    );
};
//delete controller end here 

//get all the admin courses controller here 
const myAllCourses = async (req, res) => {
    const courses = await Course.find({
        creatorId: req.user._id,
    });

    if (!courses) {
        throw new ApiError(404, "no course found");
    }

    res.json(200).json(
        new ApiResponse(200, courses, " all courses fetched successfully ")
    );
};
//get all the admin courses controller ends here 

//exporting all the controllers for routing
export { signup, signin ,createCourse ,updateCourse ,deleteCourse ,myAllCourses };
