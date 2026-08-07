import { validationResult } from "express-validator"

export const validateRequest = (req, res, next) => {
    const error = validateRequest(req);

    if (!error.isEmpty()) {
        return res.status(400).json({
            success: false, error: error.array().map((err) => ({
                field: err.path || err.param,
                message: err.msg,
            }))
        })
    };
    next();
};