import jwt from "jsonwebtoken";

async function adminMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    // Check if Authorization header is present
    if (!authHeader) {
        return res.status(401).json({ error: "No token provided" });
    }

    // Extract token from the 'Bearer <token>' format
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    try {
        // Verify the token using the secret
        const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

        // Attach the decoded admin info to the request object
        req.admin = decoded;

        // Proceed to the next middleware/controller
        next();
    } catch (error) {
        console.error("JWT verification error:", error.message); // Log the specific error
        return res.status(403).json({ error: "Invalid or expired token" });
    }
}

export default adminMiddleware;
