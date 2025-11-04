import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/response.js';

// Generate token
export const generateToken = (email) => {
    return jwt.sign(
        { email }, 
        process.env.JWT_SECRET, 
        { expiresIn: '12h' }
    );
};

// Middleware auth
export const authUser = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return errorResponse(res, 401, 108, 'Token tidak valid atau kadaluwarsa');
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        req.userEmail = decoded.email;
        next();
    } catch (error) {
        return errorResponse(res, 401, 108, 'Token tidak valid atau kadaluwarsa');
    }
};
