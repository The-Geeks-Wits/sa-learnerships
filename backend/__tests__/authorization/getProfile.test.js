const controller = require('../../authorization/controller.js');

describe('Get Profile', () => {
    it('should return a 400 status code when the request does not have a user object', async () => {
        // Mock request object
        const req = {};

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getProfile(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return an object with an error property when the request does not have a user object', async () => {
        // Mock request object
        const req = {};

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getProfile(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });

    it('should return an object with a user object that has _id property on success', async () => {
        // Mock request object
        const req = { user: { _id: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getProfile(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.user._id).toBeDefined();
    });
});
