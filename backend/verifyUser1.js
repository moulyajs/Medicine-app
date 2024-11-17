const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) return res.json("Missing token");
    else jwt.verify(token, "jwt_secret_key", (err, decoded) => {
        if(err) return res.json("Error with token");
        else if(decoded.role === "visitor")
            req.user = decoded; 
            next();
    })
}

module.exports = verifyUser;