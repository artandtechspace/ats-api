import ValidateService from "../services/validate.service";

class ValidateMiddleware {
    static prepare(schema, keyValidate = "body") {
        return async (req, res, next) => {
            try {
                await ValidateService.validate(req[keyValidate], schema);
                next();
            } catch (error) {
                next(error);
            }
        };
    }
}

export default ValidateMiddleware;