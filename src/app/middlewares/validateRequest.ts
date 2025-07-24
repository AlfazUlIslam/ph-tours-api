import type { Request, Response, NextFunction } from "express";
import type { AnyZodObject } from "zod";

const validateRequest = (zodSchema: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = JSON.parse(req.body.data) || req.body;
            req.body = await zodSchema.parseAsync(req.body);
            next();
        } catch (error) {
            next(error);
        }
    };

export default validateRequest;