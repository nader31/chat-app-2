const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "secret_nader");
        req.userData  = {email: decodedToken.email, role: decodedToken.role, username: decodedToken.username};
        next();
    } catch (error) {
        res.status(401).json({
            message:'Auth failed!'
        });
    }
    
};