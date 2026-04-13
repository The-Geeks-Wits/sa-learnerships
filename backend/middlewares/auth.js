const User = require('../authorization/User');
const jwt = require('jsonwebtoken');

const isAuthenticated = async (req, res, next) => {
    const token = req.cookies.token;

    try {
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");
        
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = { isAuthenticated};
