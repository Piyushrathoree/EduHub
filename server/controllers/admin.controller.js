
const jwt = require("jsonwebtoken");
const { Admin } = require("./models/admin.model");
const bcrypt = require("bcrypt");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { ApiError } = require("../utils/ApiError.js");
const { z } = require("zod");

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
            )
            .strict(), // this will ensure that zod can only handle three value above
    });
    // Validate the request body
    const validatedadmin = adminSchema.parse(req.body);

    // If validation passes, proceed with further logic
    const { name, email, password } = validatedadmin;

    console.log(email, password, name);

    //this will give the exact error if anything seems problematic
    if (error instanceof z.ZodError) {
        // Zod validation error
        return res.status(400).json({
            message: "Validation error",
            errors: error.errors.map((err) => err.message),
        });
    }
    // input validation overs here

    // check if the admin already exist in database
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
        new ApiError(
            400,
            json({
                message: "admin already exist",
            })
        );
    }

    //hashing the password to store in the database
    const hashPassword = bcrypt.hash(password, 10);

    console.log(hashPassword);

    // if admin is new than storing it to database
    const admin = await Admin.create({
        name,
        email,
        password: hashPassword,
    });
    
     //removing password from response
     const createdAdmin = await Admin.findById(admin._id).select(
        "-password "
    );

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
            )
            .strict(), // this will ensure that zod can only handle three value above
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
    const isPasswordCorrect = await Admin.isPasswordCorrect(password);

    //check for password
    if (!isPasswordCorrect) {
        throw new ApiError(401, " your password is wrong ");
    }

    const token = jwt.sign( email , JWT_SECRET);

    res.status(200).json(
        new ApiResponse(200 , token , " sign-in successful ")
    )
};
//sign in controller ends here






















//exporting all the controllers for routing
export {
    signup,
    signin
}
