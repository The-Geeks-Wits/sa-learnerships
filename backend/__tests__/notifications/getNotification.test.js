const controller = require('../../notifications/controller.js');
const Notification = require('../../notifications/Notification.js');

jest.mock('../../notifications/Notification.js', () => ({
    findById: jest.fn(),
}));

describe('Get Notification', () => {
    it('should return a 400 status when there are no params', async () => {
        // Mock request object
        const req = {};

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getNotification(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return an object with an error property when there are no params', async () => {
        // Mock request object
        const req = {};

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getNotification(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });

    it('should return a 400 status when params do not have an id property', async () => {
        // Mock request object
        const req = { params: {} };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getNotification(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return an object with an error property when params do not have an id property', async () => {
        // Mock request object
        const req = { params: {} };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getNotification(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });

    it('should return a 400 status when no user is provided', async () => {
        // Mock request object
        const req = { params: { id: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getNotification(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return an object with an error property when no user is provided', async () => {
        // Mock request object
        const req = { params: { id: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getNotification(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });

    it('should call the Notification.findById method when params have an id property', async () => {
        // Mock request object
        const req = { params: { id: 'test-id' }, user: { _id: 'test-user-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getNotification(req, res);
        expect(Notification.findById).toHaveBeenCalled();
    });

    it('should use the correct param id to fetch notification details', async () => {
        // Mock request object
        const req = { params: { id: 'test-id' }, user: { _id: 'test-user-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getNotification(req, res);
        // Notification gets mocked so we are not using the schema object
        expect(Notification.findById).toHaveBeenCalledWith(req.params.id);
    });

    it('should return a 400 status when the notification is not found', async () => {
        // Notification gets mocked, hence the mockResolvedValue function exists
        Notification.findById.mockResolvedValue(undefined);

        // Mock request object
        const req = { params: { id: 'test-id' }, user: { _id: 'test-user-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getNotification(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return an object with an error property when the notification is not found', async () => {
        // Notification gets mocked, hence the mockResolvedValue function exists
        Notification.findById.mockResolvedValue(undefined);

        // Mock request object
        const req = { params: { id: 'test-id' }, user: { _id: 'test-user-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getNotification(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });

    it('should return a 400 status when the notification recipient is not the same as the user id', async () => {
        // Notification gets mocked, hence the mockResolvedValue function exists
        const mockEquals = jest.fn().mockReturnValue(false);
        Notification.findById.mockResolvedValue({ recipient: { equals: mockEquals } });

        // Mock request object
        const req = { params: { id: 'test-id' }, user: { _id: 'test-user-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getNotification(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should return an object with an error property when the notification recipient is not the same as the user id', async () => {
        // Notification gets mocked, hence the mockResolvedValue function exists
        const mockEquals = jest.fn().mockReturnValue(false);
        Notification.findById.mockResolvedValue({ recipient: { equals: mockEquals } });

        // Mock request object
        const req = { params: { id: 'test-id' }, user: { _id: 'test-user-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getNotification(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });

    it('should compare the user id with the recipient', async () => {
        // Notification gets mocked, hence the mockResolvedValue function exists
        const mockEquals = jest.fn().mockReturnValue(false);
        Notification.findById.mockResolvedValue({ recipient: { equals: mockEquals } });

        // Mock request object
        const req = { params: { id: 'test-id' }, user: { _id: 'test-user-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getNotification(req, res);
        expect(mockEquals).toHaveBeenCalledWith(req.user._id);
    });

    it('should return a 200 status on success', async () => {
        // Notification gets mocked, hence the mockResolvedValue function exists
        const mockEquals = jest.fn().mockReturnValue(true);
        Notification.findById.mockResolvedValue({ recipient: { equals: mockEquals } });

        // Mock request object
        const req = { params: { id: 'test-id' }, user: { _id: 'test-user-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getNotification(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return a 500 status on error', async () => {
        // Notification gets mocked, hence the mockResolvedValue function exists
        Notification.findById.mockRejectedValue(new Error('Test error'));

        // Mock request object
        const req = { params: { id: 'test-id' }, user: { _id: 'test-user-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getNotification(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should return an object with an error property on error', async () => {
        // Notification gets mocked, hence the mockResolvedValue function exists
        Notification.findById.mockRejectedValue(new Error('Test error'));

        // Mock request object
        const req = { params: { id: 'test-id' }, user: { _id: 'test-user-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getNotification(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });
});
