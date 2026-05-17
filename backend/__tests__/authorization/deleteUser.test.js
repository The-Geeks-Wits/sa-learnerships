const User = require('../../authorization/User.js');
const controller = require('../../authorization/controller.js');

jest.mock('../../authorization/User.js', () => ({
    findByIdAndUpdate: jest.fn(),
}));

describe('Delete User', () => {
    // TODO: Test what happens when the params and params.id are not provided
    it('should search for the user by id and update the status field', async () => {
        // Mock request object
        const req = { params: { id: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.deleteUser(req, res);
        const id = req.params.id;
        const updateOptions = { status: 'disabled' };
        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(id, updateOptions, { new: true });
    });

    it('should return a 404 status when the user is not found', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findByIdAndUpdate.mockResolvedValue(undefined);

        // Mock request object
        const req = { params: { id: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.deleteUser(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return an object with a message property when the user is not found', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findByIdAndUpdate.mockResolvedValue(undefined);

        // Mock request object
        const req = { params: { id: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.deleteUser(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.message).toBeDefined();
    });

    // TODO: Test the returned response status
    it('should return an object with a message property on success', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findByIdAndUpdate.mockResolvedValue({});

        // Mock request object
        const req = { params: { id: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.deleteUser(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.message).toBeDefined();
    });

    it('should return a 500 status on error', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findByIdAndUpdate.mockRejectedValue(new Error('Test error'));

        // Mock request object
        const req = { params: { id: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.deleteUser(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should return an object with an error property on error', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findByIdAndUpdate.mockRejectedValue(new Error('Test error'));

        // Mock request object
        const req = { params: { id: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.deleteUser(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });
});
