import { Router } from "express";
import GroupsController from "../controllers/groups.controller";
import ValidateMiddleware from "../middleware/validate.middleware";
import groupSchemas from "../schemas/group.schemas";
import grouporizeMiddleware from "../middleware/grouporize.middleware";

const router = Router();

router.post(
    "/group/add",
    ValidateMiddleware.prepare(groupSchemas.signIn),
    GroupsController.signin
);

router.delete(
    "/group/delete",
    ValidateMiddleware.prepare(groupSchemas.signUp),
    GroupsController.signup
);

router.post(
    "/group/",
    grouporizeMiddleware.check_refresh,
    GroupsController.refreshTokens
);

router.post(
    "/group/session/logout",
    grouporizeMiddleware.check_access,
    GroupsController.logout
);

router.post(
    "/group/session/logout/all",
    grouporizeMiddleware.check_access,
    GroupsController.logoutAll
);
router.post(
    "/group/restore-password",
    ValidateMiddleware.prepare(groupSchemas.restorePassword),
    GroupsController.restorePassword
);
router.post(
    "/group/confirm-restore-password",
    ValidateMiddleware.prepare(groupSchemas.confirmRestorePassword),
    grouporizeMiddleware.check_restore,
    GroupsController.confirmRestorePassword
);

export default router;