import { Router } from "express";
import UserController from "../controllers/user.controller";
import AuthorizeMiddleware from "../middleware/authorize.middleware";

const router = Router();

router.post(
  "/user/update/settings",
  AuthorizeMiddleware.check_access,
  UserController.updateSettings
);

export default router;