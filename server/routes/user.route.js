import express from "express";
const router = express.Router();
import { signup, signin, userCourses } from "../controllers/user.controller.js";
import userMiddleware from "../middlewares/user.auth.middleware.js";

// routes for the sign up and sign in endpoints
router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/mycourses").get(userMiddleware , userCourses);

//export the router
export default router;
