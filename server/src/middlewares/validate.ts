import { NextFunction, Request, Response } from "express";

const validate = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            errors: result.error.flatten().fieldErrors,
        });
    }

    // Use the parsed data
    req.body = result.data;

    next();
};

export default validate;
