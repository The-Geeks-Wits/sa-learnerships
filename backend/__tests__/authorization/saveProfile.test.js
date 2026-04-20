const User = require('../../authorization/User.js');
const controller = require('../../authorization/controller.js');

jest.mock('../../authorization/User.js', () => ({
    findById: jest.fn(),
}));

describe('Save Profile', () => {
    // TODO: Test what happens when the user and user.userId are not provided
    it('should get user details using the provided userId', async () => {
        // Mock request object
        const req = { user: { userId: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.saveProfile(req, res);
        expect(User.findById).toHaveBeenCalledWith(req.user.userId);
    });

    it('should return a 404 status code when the user is not found', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findById.mockResolvedValue(undefined);

        // Mock request object
        const req = { user: { userId: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.saveProfile(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return an object with a message property when the user is not found', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findById.mockResolvedValue(undefined);

        // Mock request object
        const req = { user: { userId: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.saveProfile(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });

    it('should save the user details', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        const func = jest.fn();
        User.findById.mockResolvedValue({ save: func });

        // Mock request object
        const req = { body: {}, user: { userId: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.saveProfile(req, res);
        expect(func).toHaveBeenCalled();
    });

    it('should return a 200 status code on success', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findById.mockResolvedValue({ user: { _id: 'test-id' }, save: jest.fn() });

        // Mock request object
        const req = { body: {}, user: { userId: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.saveProfile(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return an object with a user object that has an _id property on success', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findById.mockResolvedValue({ _id: 'test-id', save: jest.fn() });

        // Mock request object
        const req = { body: {}, user: { userId: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.saveProfile(req, res);
        const json = res.json.mock.calls[0][0];
        console.log(json);
        expect(json.user._id).toBeDefined();
    });
});
