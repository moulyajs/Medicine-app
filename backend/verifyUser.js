const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) 
    {
        console.error("No token found in cookies");
        return res.status(401).json({ message: "Missing token" });
    }

    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
        if (err) 
        {
            console.error("JWT verification error:", err.message);
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        if (decoded.role !== "visitor") 
        {
            console.warn("Unauthorized role:", decoded.role);
            return res.status(403).json({ message: "Access denied for this role" });
        }
        
        req.user = decoded;
        next();
    });
};

module.exports = verifyUser;