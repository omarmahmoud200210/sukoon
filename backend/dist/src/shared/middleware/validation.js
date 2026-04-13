import { z } from "zod";
const validation = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        }
        catch (err) {
            if (err instanceof z.ZodError) {
                return res.status(400).json({
                    status: "fail",
                    errors: err.issues.map((e) => ({
                        field: e.path[1],
                        message: e.message,
                    })),
                });
            }
        }
    };
};
export default validation;
