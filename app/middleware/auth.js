const {buildErrObject} = require("./utils");
const crypto = require('crypto')
const algorithm = 'aes-256-cbc'
const secret = process.env.JWT_SECRET
const IV_LENGTH = 16

module.exports = {
    /**
     * Checks is password matches
     * @param {string} password - password
     * @param {Object} user - user object
     * @returns {boolean}
     */
    async checkPassword(password, user) {
        return new Promise((resolve, reject) => {
            user.comparePassword(password, (err, isMatch) => {
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
     * Checks is desfireSecret matches
     * @param {string} desfireSecret - Desfire Secret
     * @param {Object} user - user object
     * @returns {boolean}
     */
    async checkDesfireSecret(desfireSecret, user) {
        return new Promise((resolve, reject) => {
            user.compareDesfireSecret(desfireSecret, (err, isMatch) => {
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

    async createDesfireSecret() {
        return new Promise(async (resolve, reject) => {
            const token = crypto.randomBytes(64).toString('hex');
            return resolve(token)
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
