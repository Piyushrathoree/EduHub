import express from "express"
const router = express.Router();
import  { signup , signin } from "../controllers/admin.controller.js"
// routes for the sign up and sign in endpoints
router.route("/signup").post(signup);
router.route("/signin").post(signin);

















//export the router
export default router;
