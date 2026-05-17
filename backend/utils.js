const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.generateAccessToken = (email, id, role) => {
    const secret = process.env.JWT_SECRET || 'your_secret_key_here';
    return jwt.sign({ email, id, role }, secret, { expiresIn: '24h' });
};

exports.hashPassword = async (password) => {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    return hashedPassword;
};

exports.comparePasswords = async (plainPassword, hashedPassword) => {
    const isSimilar = await bcryptjs.compare(plainPassword, hashedPassword);
    return isSimilar;
};

// Checks if the password is strong
exports.isStrong = (password) => {
    let hasLowercase = false;
    let hasUppercase = false;
    let hasDigit = false;
    let SpecialSymbols = ['!', '@', '#', '$', '%', '&', '*'];
    let HasSpecialSymbols = false;

    for (let x of password) {
        if (x >= 'A' && x <= 'Z') {
            hasUppercase = true;
        } else if (x >= 'a' && x <= 'z') {
            hasLowercase = true;
        } else if (x >= '0' && x <= '9') {
            hasDigit = true;
        } else if (SpecialSymbols.includes(x)) {
            HasSpecialSymbols = true;
        }
    }

    return hasLowercase && hasUppercase && hasDigit && HasSpecialSymbols;
};
