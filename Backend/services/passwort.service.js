import bcrypt from 'bcryptjs';

const checkPassword = async (password, passwordHash) => {
    try {
        return await bcrypt.compare(password, passwordHash);
    } catch (err) {
        throw new err.message;
    }
}
const hashPassword = async password => {
    try {
        const salt = await bcrypt.genSalt(12);
        return await bcrypt.hash(password, salt);
    } catch (err) {
        throw new err.message;
    }
};

export default {checkPassword, hashPassword};