import jwt from "jsonwebtoken";

async function adminMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.admin = decoded;

        next();
    } catch (error) {
        return res.status(403).json({ error: "Invalid token" });
    }
}

export default adminMiddleware;
