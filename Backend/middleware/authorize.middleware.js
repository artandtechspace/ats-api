import ClientError from "../exeptions/client.error";
import TokenService from "../services/token.service";
import UserModel from "../models/user.model";


class AuthorizeMiddleware {
    static async check_access(req, res, next) {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1].split("::")[1];
            if (!token) {
                throw new ClientError(res, "Access token not found in request", 400);
            }

            const token_check = await UserModel.findOne({"webTokens.accessToken": token});
            if (!token_check) {
                throw new ClientError(res, "Access token not found", 400);
            }

            const verifyData = await TokenService.verifyAccessToken(token);

            if (!verifyData) {
                throw new ClientError(res, "Access token expired", 401);
            }

            req.userId = verifyData.id;
            return next();
        }
        throw new ClientError(res, "Unauthorized", 401);
    };

    static async check_refresh(req, res, next) {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1].split("::")[1];
            if (!token) {
                throw new ClientError(res, "Refresh token not found in request", 400);
            }

            const token_check = await UserModel.findOne({"webTokens.refreshToken": token});

            if (!token_check) {
                throw new ClientError(res, "Refresh token not found", 400);
            }

            const verifyData = await TokenService.verifyRefreshToken(token);
            if (!verifyData) {
                throw new ClientError(res, "Refresh token expired", 401);
            }

            req.userId = verifyData.id;
            return next();
        }
        throw new ClientError(res, "Unauthorized", 401);
    };

    static async check_restore(req, res, next) {
        if (req.headers.authorization) {

            const token = req.headers.authorization.split(" ")[1];

            if (!token) {
                throw new ClientError(res, "Restore token not found in request", 400);
            }

            const token_check = await UserModel.findOne({"restoreToken.token": token});

            if (!token_check) {
                throw new ClientError(res, "Restore token not found", 400);
            }

            const verifyData = await TokenService.verifyRestoreToken(token);

            if (!verifyData) {
                throw new ClientError(res, "Restore token expired", 401);
            }

            req.userId = verifyData.id;
            return next();
        }
        throw new ClientError(res, "Unauthorized", 401);
    }
}

export default AuthorizeMiddleware;