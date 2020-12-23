import path from "path";
import ejs from "ejs-promise";
import AppError from "../exeptions/app.error";
import config from "../config/mail.config";

const srcPath = path.join.bind(this, __dirname, "../");

const compileTemplate = async (template, data, options = {}) => {
    try {
        const file = path.join(srcPath(`templates/mail/${template}.ejs`));

        if (!file) {
            throw new AppError(`Could not find template: ${template} in path: ${file}`);
        }

        return await ejs.renderFile(file, data, options, (err, result) => {
            if (err) {
                throw new AppError(err.message);
            }
            return result;
        });
    } catch (err) {
        throw new AppError(err.message);
    }
};

/* eslint no-param-reassign: ["error", { "props": false }] */
const send = async data => {
    try {
        return await config.SMTPTransport.sendMail(data);
    } catch (err) {
        throw new AppError(err.message);
    }
};

const sendWithTemplate = async (data, templateOptions) => {
    try {
        const template = templateOptions.template || "";
        const dataTemplate = templateOptions.data || {};
        const options = templateOptions.options || {};

        if (!template) {
            throw new AppError(`Could not find template name in options`);
        }

        data.html = await compileTemplate(template, dataTemplate, options);

        return await send(data);
    } catch (err) {
        throw new AppError(err.message);
    }
};

export default {send, sendWithTemplate};