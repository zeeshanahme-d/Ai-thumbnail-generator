import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

type Target = "body" | "query" | "params";

const validate = (schema: ZodSchema, target: Target = "body") => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            errors: result.error.flatten().fieldErrors,
        });
    }

    if (!req.validated) {
        req.validated = {};
    }

    req.validated[target] = result.data;

    next();
};

export default validate;