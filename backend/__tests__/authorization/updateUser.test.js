const User = require('../../authorization/User.js');
const controller = require('../../authorization/controller.js');

jest.mock('../../authorization/User.js', () => ({
    findByIdAndUpdate: jest.fn(),
}));

describe('Update User', () => {
    it('should return a 400 status code when the body does not have role and status fields', async () => {
        // Mock request object
        const req = { body: {} };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return an object with a message property when the body does not have role and status fields', async () => {
        // Mock request object
        const req = { body: {} };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.updateUser(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.message).toBeDefined();
    });

    it('should return a 400 status code when the body does not have a valid role', async () => {
        // Mock request object
        const req = { body: { role: 'test-role' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return an object with a message property when the body does not have a valid role', async () => {
        // Mock request object
        const req = { body: { role: 'test-role' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.updateUser(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.message).toBeDefined();
    });

    it('should return a 400 status code when the body does not have a valid status', async () => {
        // Mock request object
        const req = { body: { status: 'test-status' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return an object with a message property when the body does not have a valid status', async () => {
        // Mock request object
        const req = { body: { status: 'test-status' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.updateUser(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.message).toBeDefined();
    });

    it('should search for the user by id and update it', async () => {
        // Mock request object
        const req = { params: { id: 'test-id' }, body: { role: 'applicant', status: 'active' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.updateUser(req, res);
        const id = req.params.id;
        const updateOptions = { status: 'disabled' };
        expect(User.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should return a 404 status code when the user was not found', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findByIdAndUpdate.mockResolvedValue(undefined);

        // Mock request object
        const req = { params: { id: 'test-id' }, body: { role: 'applicant', status: 'active' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return an object with a message property when the body does not have role and status fields', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findByIdAndUpdate.mockResolvedValue(undefined);

        // Mock request object
        const req = { params: { id: 'test-id' }, body: { role: 'applicant', status: 'active' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.updateUser(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.message).toBeDefined();
    });

    // TODO: Test the returned response status
    it('should return an object with an _id property on success', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findByIdAndUpdate.mockResolvedValue({ _id: 'test-id' });

        // Mock request object
        const req = { params: { id: 'test-id' }, body: { role: 'applicant', status: 'active' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.updateUser(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json._id).toBeDefined();
    });

    it('should return a 500 status on error', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findByIdAndUpdate.mockRejectedValue(new Error('Test error'));

        // Mock request object
        const req = { params: { id: 'test-id' }, body: { role: 'applicant', status: 'active' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should return an object with an error property on error', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findByIdAndUpdate.mockRejectedValue(new Error('Test error'));

        // Mock request object
        const req = { params: { id: 'test-id' }, body: { role: 'applicant', status: 'active' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.updateUser(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });
});
