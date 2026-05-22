const express = require('express');
const routes = require('../../authorization/routes.js');
const controller = require('../../authorization/controller.js');
const multer = require('multer');

jest.mock('express', () => {
    const mockRouter = {
        post: jest.fn(),
        get: jest.fn(),
        put: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
    };
    return { Router: jest.fn(() => mockRouter) };
});

jest.mock('multer', () => {
    const multerMock = jest.fn().mockReturnValue({ single: jest.fn() });
    multerMock.diskStorage = jest.fn();
    return multerMock;
});

// We have tested the controller and assume that it is working as inteded so here we mock it to test everything as a unit
jest.mock('../../authorization/controller.js', () => ({
    register: jest.fn(),
    login: jest.fn(),
    deleteUser: jest.fn(),
    updateUser: jest.fn(),
    getUsers: jest.fn(),
    getUserById: jest.fn(),
}));

describe('Auth & User Routes', () => {
    beforeEach(() => {
        console.log = jest.fn();
    });

    it('calls the express router function', () => {
        expect(express.Router).toHaveBeenCalled();
    });

    it('calls the router GET method 5 times', () => {
        const mockRouter = express.Router();
        expect(mockRouter.get).toHaveBeenCalledTimes(5);
    });

    it('calls the router POST method 3 times', () => {
        const mockRouter = express.Router();
        expect(mockRouter.post).toHaveBeenCalledTimes(3);
    });

    it('calls the disk storage function from multer', () => {
        expect(multer.diskStorage).toHaveBeenCalled();
    });
});
