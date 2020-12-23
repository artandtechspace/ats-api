import UserModel from "../models/user.model";
import ClientError from "../exeptions/client.error";
import TryCatchErrorDecorator from "../decorators/TryCatchError.decorator";
import _ from "lodash";

class UserController {
  @TryCatchErrorDecorator
  static async updateSettings(req, res) {
    const user = await UserModel.findOne({ _id: req.userId });
    const settings = req.body.settings;
    if (!settings) {
      throw new ClientError(
        res,
        "settings is required to update user settings",
        401
      );
    }
    _.merge(user.data.settings,settings);
    await user.save();

    user.webTokens = [];
    user.password = "";

    res.json({
      user,
    });
  }

  @TryCatchErrorDecorator
  static async updateShortcuts(req, res) {
    const user = await UserModel.findOne({ _id: req.userId });
    const shortcuts = req.body.shortcuts;
    if (!shortcuts) {
      throw new ClientError(
        res,
        "shortcuts is required to update user settings",
        401
      );
    }
    _.merge(user.data.shortcuts,shortcuts);
    await user.save();

    user.webTokens = [];
    user.password = "";

    res.json({
      user,
    });
  }
}

export default UserController;
