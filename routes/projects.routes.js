import {Router} from "express";
import ValidateMiddleware from "../middleware/validate.middleware";
import projectSchemas from "../schemas/";
import ProjectController from "../controllers/projects.controller";
import AuthorizeMiddleware from "../middleware/authorize.middleware";

const router = Router();

router.post(
    "/project/add",
    AuthorizeMiddleware.check_access,
    ValidateMiddleware.prepare(projectSchemas.add),
    ProjectController.add
);

router.post(
    "/project/update",
    ValidateMiddleware.prepare(authSchemas.signIn),
    AuthController.signin
);

router.post(
    "/project/update/member",
    ValidateMiddleware.prepare(authSchemas.signIn),
    AuthController.signin
);

router.post(
    "/project/update/milestone",
    ValidateMiddleware.prepare(authSchemas.signIn),
    AuthController.signin
);

router.post(
    "/project/remove",
    ValidateMiddleware.prepare(authSchemas.signIn),
    AuthController.signin
);

router.post(
    "/project/member/change/sub",
    ValidateMiddleware.prepare(authSchemas.signIn),
    AuthController.signin
);

router.post(
    "/project/member/add",
    ValidateMiddleware.prepare(authSchemas.signIn),
    AuthController.signin
);

export default router;