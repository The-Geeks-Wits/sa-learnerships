const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const utils = require('../utils.js');

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
    genSalt: jest.fn(),
    hash: jest.fn(),
    compare: jest.fn(),
}));

describe('Utils - Generate Access Token', () => {
    it('should generate the token using the provided email and userId', () => {
        const email = 'test-email';
        const userId = 'test-id';
        utils.generateAccessToken(email, userId);
        expect(jwt.sign).toHaveBeenCalled(); // TODO: Construct proper toHaveBeenCalledWith arguments
    });

    it('should return the generated token', async () => {
        const value = 'test-jwt';
        jwt.sign.mockResolvedValue(value);
        const token = await utils.generateAccessToken('test-email', 'test-id');
        expect(token).toBe(value); // TODO: Construct proper toHaveBeenCalledWith arguments
    });
});

describe('Utils - Hash Password', () => {
    it('should generate the salt using 10 rounds', async () => {
        const password = 'test-password';
        await utils.hashPassword(password);
        expect(bcryptjs.genSalt).toHaveBeenCalled();
    });

    it('should hash the password using the generated salt', async () => {
        const value = 'test-salt';
        bcryptjs.genSalt.mockResolvedValue(value);
        const password = 'test-password';
        await utils.hashPassword(password);
        expect(bcryptjs.hash).toHaveBeenCalledWith(password, value);
    });

    it('should return the correct hashed password', async () => {
        const value = 'test-hashed-pass';
        bcryptjs.hash.mockResolvedValue(value);
        const hashedPassword = await utils.hashPassword('test-password');
        expect(hashedPassword).toBe(value);
    });
});

describe('Utils - Compare Passwords', () => {
    it('should compare the provided passwords', async () => {
        const plainPassword = 'test-plain-pass';
        const hashedPassword = 'test-hashed-pass';
        await utils.comparePasswords(plainPassword, hashedPassword);
        expect(bcryptjs.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
    });

    it('should return the correct comparison', async () => {
        const value = true;
        bcryptjs.compare.mockResolvedValue(value);
        const isSimilar = await utils.comparePasswords('test-plain-pass', 'test-hashed-pass');
        expect(isSimilar).toBe(value);
    });
});

describe('Utils - Compare Passwords', () => {
    it('should return false if the password has no uppercase', () => {
        const isStr = utils.isStrong('a0@');
        expect(isStr).toBe(false);
    });

    it('should return false if the password has no lowercase', () => {
        const isStr = utils.isStrong('A0@');
        expect(isStr).toBe(false);
    });

    it('should return false if the password has no digit', () => {
        const isStr = utils.isStrong('Aa@');
        expect(isStr).toBe(false);
    });

    it('should return false if the password has no special symbol', () => {
        const isStr = utils.isStrong('Aa');
        expect(isStr).toBe(false);
    });

    it('should return false if the password has all special symbols', () => {
        const isStr = utils.isStrong('!@#$%@*');
        expect(isStr).toBe(false);
    });

    it('should return true if the password has all symbols', () => {
        const isStr = utils.isStrong('Aa0@');
        expect(isStr).toBe(true);
    });
});
