import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import config from "../config/token.config";
import AppError from "../exeptions/app.error";

const createAccessToken = async user => {
    try {
        const payload = {
            id: user._id
        };

        const options = {
            algorithm: "HS512",
            subject: user._id.toString(),
            expiresIn: config.expireAccess
        };

        return await jwt.sign(payload, config.secretAccess, options);
    } catch (err) {
        throw new AppError(err.message);
    }
};

const createRefreshToken = async user => {
    try {
        const payload = {
            id: user._id
        };

        const options = {
            algorithm: "HS512",
            subject: user._id.toString(),
            expiresIn: config.expireRefresh
        };

        return await jwt.sign(payload, config.secretRefresh, options);
    } catch (err) {
        throw new AppError(err.message);
    }
};

const createRestoreToken = async user => {
    try {
        const payload = {
            id: user._id
        };

        const options = {
            algorithm: "HS512",
            subject: user._id.toString(),
            expiresIn: config.expireRestore
        };

        return await jwt.sign(payload, config.secretRestore, options);
    } catch (err) {
        throw new AppError(err.message);
    }
};


const removeRefreshTokenUser = async (user, token) => {
    try {
        const refreshTokenId = token.split("::")[0];

        user.refreshTokens = user.refreshTokens.filter(refreshToken => {
            return refreshToken._id.toString() !== refreshTokenId.toString();
        });

        await user.save();

        return true;
    } catch (err) {
        throw new AppError(err.message);
    }
};

const addWebTokensUser = async (user, AccessToken, RefreshToken) => {
    try {
        const objectId = mongoose.Types.ObjectId()
        user.webTokens.push({_id: objectId, accessToken: AccessToken, refreshToken: RefreshToken});
        let webTokens = {
            accessToken: objectId + "::" + AccessToken,
            refreshToken: objectId + "::" + RefreshToken
        }
        await user.save();
        return webTokens;
    } catch (err) {
        throw new AppError(err.message);
    }
};

const addRestoreTokenUser = async (user, token) => {
    try {
        user.restoreToken.token = token;

        await user.save();

        return token;
    } catch (err) {
        throw new AppError(err.message);
    }
};

const verifyAccessToken = async token => {
    try {
        return await jwt.verify(token, config.secretAccess);
    } catch (err) {
        return false;
    }
};

const verifyRefreshToken = async token => {
    try {
        return await jwt.verify(token, config.secretRefresh);
    } catch (err) {
        return false;
    }
};

const verifyRestoreToken = async token => {
    try {
        return await jwt.verify(token, config.secretRestore);
    } catch (err) {
        return false;
    }
};

const checkAccessTokenUser = async (user, token) => {
    try {
        const isValid = user.webTokens.accessToken.find(token);

        return !!isValid;
    } catch (err) {
        throw new AppError(err.message);
    }
};

const checkRefreshTokenUser = async (user, token) => {
    try {
        const isValid = user.webTokens.refreshToken.find(token);

        return !!isValid;
    } catch (err) {
        throw new AppError(err.message);
    }
};

const checkRestoreTokenUser = async (user, token) => {
    try {
        const isValid = user.restoreToken.token.find(token);
        return !!isValid;
    } catch (err) {
        return false;
    }
};

export default {
    createAccessToken,
    createRefreshToken,
    createRestoreToken,
    addWebTokensUser,
    addRestoreTokenUser,
    removeRefreshTokenUser,
    verifyRefreshToken,
    verifyAccessToken,
    verifyRestoreToken,
    checkRefreshTokenUser,
    checkAccessTokenUser,
    checkRestoreTokenUser
};