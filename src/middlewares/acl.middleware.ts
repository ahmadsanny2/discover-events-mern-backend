import { IReqUser } from './../utils/interfaces';
import { NextFunction, Response } from "express";

export default (roles: string[]) => {
    return (req: IReqUser, res: Response, next: NextFunction) => {
        const role = req.user?.role;

        if (!role || !roles.includes(role)) {
            return res.status(403).json({
                message: "Forbidden",
                data: null,
            });
        }

        next()
    };
};
