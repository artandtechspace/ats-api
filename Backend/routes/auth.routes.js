import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import ValidateMiddleware from "../middleware/validate.middleware";
import AuthorizeMiddleware from "../middleware/authorize.middleware";
import authSchemas from "../schemas/auth.schemas";

const router = Router();

router.post(
    "/auth/signin",
    ValidateMiddleware.prepare(authSchemas.signIn),
    AuthController.signin
);
router.post(
    "/auth/signup",
    ValidateMiddleware.prepare(authSchemas.signUp),
    AuthController.signup
);
router.post(
    "/auth/refresh-tokens",
    AuthorizeMiddleware.check_refresh,
    AuthController.refreshTokens
);
router.post(
    "/auth/session/logout",
    AuthorizeMiddleware.check_access,
    AuthController.logout
);
router.post(
    "/auth/session/logout/all",
    AuthorizeMiddleware.check_access,
    AuthController.logoutAll
);
router.post(
    "/auth/restore-password",
    ValidateMiddleware.prepare(authSchemas.restorePassword),
    AuthController.restorePassword
);
router.post(
    "/auth/confirm-restore-password",
    ValidateMiddleware.prepare(authSchemas.confirmRestorePassword),
    AuthorizeMiddleware.check_restore,
    AuthController.confirmRestorePassword
);

export default router;