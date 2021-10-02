const {buildErrObject} = require("./utils");
const crypto = require('crypto')
const algorithm = 'aes-256-cbc'
const secret = process.env.JWT_SECRET
const IV_LENGTH = 16

module.exports = {

    /**
     * Checks is desfireSecret matches
     * @param {string} accessControlSecret - Desfire Secret
     * @param {Object} accessControl
     * @returns {boolean}
     */
    async checkAccessControlSecret(accessControlSecret, accessControl) {
        return new Promise(async (resolve, reject) => {
            console.log("lol2")
            await accessControl.compareDeviceSecret(accessControlSecret, (err, isMatch) => {
                if (err) {
                    reject(buildErrObject(422, err.message))
                }
                if (!isMatch) {
                    resolve(false)
                }
                resolve(true)
            })
        })
    },

    /**
     * Encrypts text
     * @param {string} text - text to encrypt
     */
    encrypt(text) {
        try {
            let iv = crypto.randomBytes(IV_LENGTH);
            let cipher = crypto.createCipheriv(algorithm, Buffer.from(secret), iv);
            let encrypted = cipher.update(text);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            return iv.toString('hex') + ':' + encrypted.toString('hex');
        } catch (err) {
            return err
        }
    },

    /**
     * Decrypts text
     * @param {string} text - text to decrypt
     */
    decrypt(text) {
        try {
            let textParts = text.split(':');
            let iv = Buffer.from(textParts.shift(), 'hex');
            let encryptedText = Buffer.from(textParts.join(':'), 'hex');
            let decipher = crypto.createDecipheriv(algorithm, Buffer.from(secret), iv);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString();
        } catch (err) {
            return err
        }
    }
}
