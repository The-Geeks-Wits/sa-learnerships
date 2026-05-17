const User = require('../../authorization/User.js');
const controller = require('../../authorization/controller.js');

jest.mock('../../authorization/User.js', () => ({
    find: jest.fn(),
}));

describe('Get Users', () => {
    beforeEach(() => {
        console.log = jest.fn();
    });

    // TODO: Test what happens when the search query params are not provided
    it('should get all users when the are no search query params', async () => {
        // Mock request object
        const req = { query: {} };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getUsers(req, res);
        expect(User.find).toHaveBeenCalledWith(req.query);
    });

    it('should get searched users when the are search query params', async () => {
        // Mock request object
        const req = { query: { role: 'applicant', search: 'test-username' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getUsers(req, res);
        expect(User.find).toHaveBeenCalled(); // TODO: Construct a proper toHaveBeenCalledWith argument
    });

    // TODO: Test the returned response status
    it('should return a list with objects that have an _id property on success', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.find.mockResolvedValue([{ _id: 'test-id' }]);

        // Mock request object
        const req = { query: {} };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getUsers(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json[0]._id).toBeDefined();
    });

    it('should return a 500 status on error', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.find.mockRejectedValue(new Error('Test error'));

        // Mock request object
        const req = { query: {} };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getUsers(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should return an object with an error property on error', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.find.mockRejectedValue(new Error('Test error'));

        // Mock request object
        const req = { params: { id: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getUsers(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });
});
