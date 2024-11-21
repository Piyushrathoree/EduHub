import { Purchase } from "../models/purchase.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Course } from "../models/course.model.js";
import ApiError from "../utils/ApiError.js";

const purchase = async (req, res) => {
    const userId = req.user._id;
    const courseId = req.params;

    // should check that the user has actually paid the price
    const purchaseMade = await Purchase.create({
        userId,
        courseId,
    });

    res.status(200).json(
        new ApiResponse(200, purchaseMade, "purchase done succssfully")
    );
};

//get all the courses
const preview = async (req, res) => {
    const courses = await Course.find({});

    if (!courses) {
        throw new ApiError(404, " no courses found ");
    }
    res.status(200).json(
        new ApiResponse(200, courses, "all courses fetched successfully ")
    );
};
export { purchase, preview };
