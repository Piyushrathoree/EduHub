import express from "express";
const router = express.Router();
import { purchase, preview } from "../controllers/course.controller.js";
import userMiddleware from "../middlewares/user.auth.middleware.js";

// routes for the sign up and sign in endpoints
router.route("/purchase/:courseId").post(userMiddleware, purchase);

router.route("/all").get(preview);

//export the router
export default router;
