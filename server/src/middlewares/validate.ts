import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { ApiResponse } from "../utils/apiResponse.js";
import { RequestErrorCode } from "../constants/enums.js";

type Target = "body" | "query" | "params";

const validate = (schema: ZodSchema, target: Target = "body") => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
        const fields = result.error.issues.reduce((acc, issue) => {
            acc[issue.path[0] as string] = issue.message;
            return acc;
        }, {} as Record<string, string>);

        return ApiResponse.error(res, 400, result.error.issues[0]?.message || "Validation failed", {
            code: RequestErrorCode.ValidationFailed,
            fields,
        });
    }

    if (!req.validated) {
        req.validated = {};
    }

    req.validated[target] = result.data;

    next();
};

export default validate;