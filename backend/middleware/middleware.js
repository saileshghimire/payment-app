const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req,res,next) => {
    const authHeader = req.headers.authorization;
    // console.log("middleware called");
    
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(403).json({});
    }

    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token,JWT_SECRET);
        // console.log(decoded);
        if(decoded.userId){
            req.userId = decoded.userId;
            // console.log("called...");
            next();
        }
    } catch(error){
        return res.status(403).json({
            error
        });
    }
}

module.exports = {
    authMiddleware
};
