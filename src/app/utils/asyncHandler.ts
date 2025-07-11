import type { Request, Response, NextFunction } from "express";

type TController = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const asyncHandler = (fn: TController) =>
    (req: Request, res: Response, next: NextFunction) => 
        Promise
            .resolve(fn(req, res, next))
            .catch(next);

export default asyncHandler;