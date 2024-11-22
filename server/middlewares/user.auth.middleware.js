import jwt from "jsonwebtoken";

async function userMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    // Check if the Authorization header is present
    if (!authHeader) {
        return res.status(401).json({ error: "token is missing " });
    }

    // Ensure the token is in the "Bearer <token>" format
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    if (!token) {
        return res.status(401).json({ error: "token not found " });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.USER_JWT_SECRET);

        // Attach the decoded user information to the request object
        req.user = decoded;

        // Proceed to the next middleware
        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);

        return res.status(403).json({
            error: "Invalid or expired token",
        });
    }
}

export default userMiddleware;
