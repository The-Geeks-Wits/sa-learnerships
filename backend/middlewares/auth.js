const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }

    next();
};

const verifyTokenCookie = (req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        if (!token){
            return res.status(401).json({message: "No Token Provided"});
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        return res.status(401).json({message: "Invalid Token"});
    }
};



//middleware to check if the user is admin or not
exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    next();
};

//middleware to check if the user is provider or not
exports.isProvider = (req, res, next) => {
    if (req.user.role !== 'provider') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};
module.exports = { authMiddleware, verifyTokenCookie, isAdmin, isProvider };
