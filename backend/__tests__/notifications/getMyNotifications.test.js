const controller = require('../../notifications/controller.js');
const Notification = require('../../notifications/Notification.js');

jest.mock('../../notifications/Notification.js', () => ({
    find: jest.fn(),
}));

describe('Get My Notifications', () => {
    beforeEach(() => {
        console.log = jest.fn();
    });

    it('should return a 400 status when no user is provided', async () => {
        // Mock request object
        const req = {};

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getMyNotifications(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return an object with an error property when no user is provided', async () => {
        // Mock request object
        const req = {};

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getMyNotifications(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });

    it('should call the Notification.find method when the user is provided', async () => {
        // Mock request object
        const req = { user: { _id: 'test-user-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getMyNotifications(req, res);
        expect(Notification.find).toHaveBeenCalled();
    });

    it('should return a 200 status on success', async () => {
        // Notification gets mocked, hence the mockResolvedValue function exists
        Notification.find.mockResolvedValue({});

        // Mock request object
        const req = { user: { _id: 'test-user-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getMyNotifications(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return a 500 status on error', async () => {
        // Notification gets mocked, hence the mockResolvedValue function exists
        Notification.find.mockRejectedValue(new Error('Test error'));

        // Mock request object
        const req = { user: { _id: 'test-user-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getMyNotifications(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should return an object with an error property on error', async () => {
        // Notification gets mocked, hence the mockResolvedValue function exists
        Notification.find.mockRejectedValue(new Error('Test error'));

        // Mock request object
        const req = { user: { _id: 'test-user-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getMyNotifications(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });
});
