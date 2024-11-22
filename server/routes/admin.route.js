import express from "express";
const router = express.Router();
import {
    signup,
    signin,
    createCourse,
    updateCourse,
    deleteCourse,
    myAllCourses,
} from "../controllers/admin.controller.js";
import adminMiddleware from "../middlewares/admin.auth.middleware.js";

// routes for the sign up and sign in endpoints
router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/create").post(adminMiddleware , createCourse);
router.route("/delete/:courseId").delete(adminMiddleware , deleteCourse);
router.route("/update/:courseId").put(adminMiddleware , updateCourse);
router.route("/mycourses").get(adminMiddleware , myAllCourses);

//export the router
export default router;
