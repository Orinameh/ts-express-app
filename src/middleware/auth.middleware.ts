import { NextFunction, Response } from 'express';
import { DataStoredInToken } from 'interfaces/tokenData.interface';
import * as jwt from 'jsonwebtoken';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import userModel from '../users/user.model';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';

async function authMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
    const cookies = req.cookies;
    if (cookies && cookies.Authorization) {
        const secret = process.env.JWT_SECRET;
        try {
            // jwt.verify(cookies.Authorization, secret) as DataStoredInToken
            const verificationResponse = <DataStoredInToken>jwt.verify(cookies.Authorization, secret);
            const id = verificationResponse._id;
            const user = await userModel.findOne({ _id: id }).exec();
            if (user) {
                req.user = user;
                next();
            } else {
                next(new WrongAuthenticationTokenException());
            }
        } catch (error) {
            next(new WrongAuthenticationTokenException());
        }
    } else {
        next(new WrongAuthenticationTokenException())
    }
}

export default authMiddleware;