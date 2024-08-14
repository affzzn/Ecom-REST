import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Extend Express Request to include userId
interface CustomRequest extends Request {
    userId?: string;
}

const verifyJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        // Get the token from the cookies
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "You need to log in" });
        }

        // Verify the token using the secret key
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.userId = decodedToken._id;

        console.log("passed")

        // Call the next middleware
        next();
    } catch (error) {

        res.status(500).json({ message: "Internal server error" });
    }
};

export default verifyJWT;
