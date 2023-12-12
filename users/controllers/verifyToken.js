const JWT_KEY = process.env.JWT_KEY;
const jwt = require("jsonwebtoken");

module.exports.protectRoute = async function protectRoute(req, res, next){
    try {
        let authHeader = req.headers['authorization'];
        // console.log(authHeader);
        let token;
    
        if(!authHeader)
            return res.status(403).send("Access denied");
    
        if(authHeader.startsWith("Bearer ")){
            token = authHeader.slice(7, authHeader.length).trimLeft();
        }
    
        let verified = await jwt.verify(token, JWT_KEY);
        req.user = verified;

        next();
    } catch (error) {
        return res.status(404).send(error);
    }
}