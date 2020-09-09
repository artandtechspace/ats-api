import UserModel from "../models/user.model";
import PasswordService from "../services/passwort.service";
import ClientError from "../exeptions/client.error";
import TryCatchErrorDecorator from "../decorators/TryCatchError.decorator";
import TokenService from "../services/token.service";
import AppError from "../exeptions/app.error";
import MailerService from "../services/mailer.service";
import jwt from "jsonwebtoken";
import _ from "lodash";

class AuthController {
  @TryCatchErrorDecorator
  static async signin(req, res) {
    res.set({ "content-type": "application/json; charset=utf-8" });
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      throw new ClientError(res, "User not found", 404);
    }
    const checkPassword = await PasswordService.checkPassword(
      req.body.password,
      user.password
    );

    if (!checkPassword) {
      throw new ClientError(res, "Incorrect email or password", 401);
    }

    const webToken = await TokenService.addWebTokensUser(
      user,
      await TokenService.createAccessToken(user),
      await TokenService.createRefreshToken(user)
    );

    user.webTokens = [];
    user.password = "";

    res.json({
      webToken,
      user,
    });
  }

  @TryCatchErrorDecorator
  static async signup(req, res) {
    res.set({ "content-type": "application/json; charset=utf-8" });
    const isAlreadyUser = await UserModel.findOne({ email: req.body.email });
    if (isAlreadyUser) {
      throw new ClientError(res, "This email is already registered", 409);
    }
    const password = await PasswordService.hashPassword(req.body.password);
    const user = new UserModel({
      lastname: req.body.lastname,
      firstname: req.body.firstname,
      email: req.body.email,
      password: password,
    });

    const webToken = await TokenService.addWebTokensUser(
      user,
      await TokenService.createAccessToken(user),
      await TokenService.createRefreshToken(user)
    );

    await user.save();
    /*   await MailerService.sendWithTemplate(
                                             {
                                               from: '"Projektlabor Team 👻" <it@projektlabor.org>',
                                               to: user.email,
                                               subject: "Thanks for registering ✔",
                                             },
                                             {
                                               template: "singup",
                                               data: {
                                                 email: user.email,
                                                 firstname: user.firstname,
                                                 lastname: user.lastname,
                                               },
                                             }
                                           );*/

    user.webTokens = [];
    user.password = "";

    res.json({
      webToken,
      user,
    });
  }

  @TryCatchErrorDecorator
  static async refreshTokens(req, res) {
    const user = await UserModel.findOne({ _id: req.userId });

    const checkPassword = await PasswordService.checkPassword(
      req.body.password,
      user.password
    );

    if (!checkPassword) {
      throw new ClientError(res, "Incorrect password", 401);
    }

    user.webTokens.remove(
      req.headers.authorization.split(" ")[1].split("::")[0]
    );

    await user.save();

    const webToken = await TokenService.addWebTokensUser(
      user,
      await TokenService.createAccessToken(user),
      await TokenService.createRefreshToken(user)
    );

    user.webTokens = [];
    user.password = "";
    res.json({
      webToken,
      user,
    });
  }

  @TryCatchErrorDecorator
  static async logout(req, res, next) {
    const user = await UserModel.findOne({ _id: req.userId });
    if (!user) {
      throw new AppError("UserId not found in request", 401);
    }
    user.webTokens.remove(
      req.headers.authorization.split(" ")[1].split("::")[0]
    );
    await user.save();

    res.json({
      user,
    });
  }

  @TryCatchErrorDecorator
  static async sessionVerify(req, res, next) {
    const user = await UserModel.findOne({ _id: req.userId });
    const token = req.headers.authorization.split(" ")[1].split("::")[1];
    console.log(token);
    const a_id = _.findLastIndex(user.webTokens, function (o) {
      return o.accessToken == token;
    });

    const WebToken = user.webTokens[a_id];

    user.webTokens = [];
    user.password = "";

    res.json({
      webToken: {
        accessToken: WebToken._id + "::" + WebToken.accessToken,
        refreshToken: WebToken._id + "::" + WebToken.refreshToken,
      },
      user,
    });
  }

  @TryCatchErrorDecorator
  static async logoutAll(req, res, next) {
    const user = await UserModel.findOne({ _id: req.userId });
    if (!user) {
      throw new AppError("UserId not found in request", 401);
    }
    user.webTokens = [];
    await user.save();

    await MailerService.sendWithTemplate(
      {
        from: '"Projektlabor Team 👻" <it@projektlabor.org>', // sender address
        to: user.email,
        subject: "Thanks for registering ✔",
      },
      {
        template: "singup",
        data: {
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
        },
      }
    );
    res.json({ status: "success" });
  }

  @TryCatchErrorDecorator
  static async restorePassword(req, res, next) {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      throw new ClientError(res, "User not found", 404);
    }

    const token = await TokenService.addRestoreTokenUser(
      user,
      await TokenService.createRestoreToken(user)
    );

    await MailerService.sendWithTemplate(
      {
        from: '"Projektlabor Team 👻" <it@projektlabor.org>', // sender address
        to: user.email,
        subject: "Password Restore ✔",
      },
      {
        template: "restorePassword",
        data: {
          host: "localhost",
          token: token,
        },
      }
    );
    res.json({ status: "success" });
  }

  @TryCatchErrorDecorator
  static async confirmRestorePassword(req, res, next) {
    const user = await UserModel.findOne({ _id: req.userId });

    user.password = await PasswordService.hashPassword(req.body.password);

    await user.save();

    res.json({ status: "success" });
  }
}

export default AuthController;
