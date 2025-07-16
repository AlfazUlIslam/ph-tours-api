import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

type TController = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const asyncHandler = (fn: TController) =>
    (req: Request, res: Response, next: NextFunction) => 
        Promise
            .resolve(fn(req, res, next))
            .catch((error: any) => {
                if (env.NODE_ENV === "development") {
                    console.log(error);
                };
                next(error);
            });

export default asyncHandler;