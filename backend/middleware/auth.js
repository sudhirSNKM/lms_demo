const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }

    try {
        // Demo mode - accept any token that starts with 'demo-token-'
        if (token.startsWith('demo-token-')) {
            // Extract email from token
            const emailBase64 = token.replace('demo-token-', '');
            const email = Buffer.from(emailBase64, 'base64').toString('utf-8');

            req.user = {
                id: 'demo-user',
                email: email,
                name: email.split('@')[0],
                role: 'admin'
            };
            next();
        } else {
            return res.status(401).json({ success: false, error: 'Invalid token format' });
        }
    } catch (err) {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};
