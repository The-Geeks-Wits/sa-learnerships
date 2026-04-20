const User = require('../../authorization/User.js');
const controller = require('../../authorization/controller.js');
const fs = require('fs');
const path = require('path');

jest.mock('fs', () => ({ existsSync: jest.fn(), unlinkSync: jest.fn() }));
jest.mock('path', () => ({ join: jest.fn() }));
jest.mock('../../authorization/User.js', () => ({
    findById: jest.fn(),
}));

describe('Upload CV', () => {
    it('should return a 400 status code when a file is not provided', async () => {
        // Mock request object
        const req = {};

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.uploadCV(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return an object with a message property when a file is not provided', async () => {
        // Mock request object
        const req = {};

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.uploadCV(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.message).toBeDefined();
    });

    // TODO: Test what happens when the user and user.userId are not provided
    it('should get user details using the provided userId', async () => {
        // Mock request object
        const req = { file: {}, user: { userId: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.uploadCV(req, res);
        expect(User.findById).toHaveBeenCalledWith(req.user.userId);
    });

    it('should join the cwd with the users cv when its provided', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        const userCV = 'test-cv';
        User.findById.mockResolvedValue({ cv: userCV });

        // Mock request object
        const req = { file: {}, user: { userId: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.uploadCV(req, res);
        expect(path.join).toHaveBeenCalledWith(process.cwd(), userCV);
    });

    it('should check if the file already exists when the user has a cv', async () => {
        // User and path gets mocked, hence the mockResolvedValue function exists
        User.findById.mockResolvedValue({ cv: 'test-cv' });
        const p = 'test-path';
        path.join.mockReturnValue(p);

        // Mock request object
        const req = { file: {}, user: { userId: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.uploadCV(req, res);
        expect(fs.existsSync).toHaveBeenCalledWith(p);
    });

    it('should override the file when the user has a cv and the file already exists', async () => {
        // User, path and fs gets mocked, hence the mockResolvedValue function exists
        User.findById.mockResolvedValue({ cv: 'test-cv' });
        const p = 'test-path';
        path.join.mockReturnValue(p);
        fs.existsSync.mockReturnValue(true);

        // Mock request object
        const req = { file: {}, user: { userId: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.uploadCV(req, res);
        expect(fs.unlinkSync).toHaveBeenCalledWith(p);
    });

    it('should save the user details', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        const func = jest.fn();
        User.findById.mockResolvedValue({ save: func });

        // Mock request object
        const req = { file: {}, user: { userId: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.uploadCV(req, res);
        expect(func).toHaveBeenCalled();
    });

    // TODO: Test the returned response status
    it('should return an object with a cv property on success', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findById.mockResolvedValue({ save: jest.fn() });

        // Mock request object
        const req = { file: {}, user: { userId: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.uploadCV(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.cv).toBeDefined();
    });

    it('should return a 500 status on error', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findById.mockRejectedValue(new Error('Test error'));

        // Mock request object
        const req = { file: {}, user: { userId: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.uploadCV(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should return an object with a message property on error', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findById.mockRejectedValue(new Error('Test error'));

        // Mock request object
        const req = { file: {}, user: { userId: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.uploadCV(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.message).toBeDefined();
    });
});
