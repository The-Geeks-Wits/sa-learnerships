const User = require('../../authorization/User.js');
const controller = require('../../authorization/controller.js');

jest.mock('../../authorization/User.js', () => ({
    findById: jest.fn(),
}));

describe('Get Profile', () => {
    // TODO: Test what happens when the user and user.userId are not provided
    it('should get user details using the provided userId', async () => {
        // Mock request object
        const req = { user: { userId: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getProfile(req, res);
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

        await controller.getProfile(req, res);
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

        await controller.getProfile(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.message).toBeDefined();
    });

    // TODO: Test the returned response status
    it('should return an object with a user object that has _id property on success', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findById.mockResolvedValue({ _id: 'test-id' });

        // Mock request object
        const req = { user: { userId: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getProfile(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.user._id).toBeDefined();
    });

    it('should return a 500 status on error', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findById.mockRejectedValue(new Error('Test error'));

        // Mock request object
        const req = { user: { userId: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getProfile(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should return an object with a message property on error', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findById.mockRejectedValue(new Error('Test error'));

        // Mock request object
        const req = { user: { userId: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getProfile(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.message).toBeDefined();
    });
});
