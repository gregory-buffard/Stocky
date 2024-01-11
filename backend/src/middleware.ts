import {UserRequest} from "./types";
import {NextFunction, Response} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import User from "./models/User";

const JWT = process.env.JWT_SECRET || '';

const authenticate = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).send('Access denied.')
        }

        const decoded = jwt.verify(token, JWT) as JwtPayload;
        const userId = decoded.id as string;

        req.user = await User.findById(userId);
        next();
    } catch (error) {
        console.log(error);
        res.status(400).send('Invalid token.')
    }
};

export default authenticate;