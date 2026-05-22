const Notification = require('../../notifications/Notification.js');
const { updateNotification } = require('../../notifications/controller.js');

jest.mock('../../notifications/Notification.js', () => ({
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
}));

describe('Update Notification', () => {
    let req;
    let res;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            params: { id: 'notif123' },
            body: { read: true },
            user: { _id: 'user123' },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        console.log = jest.fn();
    });

    it('should return 400 if body is missing', async () => {
        req.body = null;

        await updateNotification(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Update details are missing! Please provide some details to update',
        });

        expect(Notification.findById).not.toHaveBeenCalled();
    });

    it('should return 400 if read is undefined', async () => {
        req.body = {};

        await updateNotification(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Update details are missing! Please provide some details to update',
        });
    });

    it('should return 400 if notification id is missing', async () => {
        req.params = {};

        await updateNotification(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Notification id required! Please provide a valid notification id',
        });
    });

    it('should return 400 if user is missing', async () => {
        req.user = null;

        await updateNotification(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Recipient required! Please provide the recipient of the notifications',
        });
    });

    it('should return 400 if notification not found', async () => {
        Notification.findById.mockResolvedValue(null);

        await updateNotification(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Notification not found! Please check your id and try again',
        });
    });

    it('should return 401 if user is not recipient', async () => {
        const mockNotif = {
            recipient: {
                equals: jest.fn().mockReturnValue(false),
            },
        };

        Notification.findById.mockResolvedValue(mockNotif);

        await updateNotification(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Invalid receipt! You need to be the receipt of the notification',
        });
    });

    it('should return 400 if update fails', async () => {
        const mockNotif = {
            recipient: {
                equals: jest.fn().mockReturnValue(true),
            },
        };

        Notification.findById.mockResolvedValue(mockNotif);

        Notification.findByIdAndUpdate.mockResolvedValue(null);

        await updateNotification(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: "Couldn't update notification! Please try again later",
        });
    });

    it('should update notification successfully', async () => {
        const updated = {
            _id: 'notif123',
            read: true,
        };

        const mockNotif = {
            recipient: {
                equals: jest.fn().mockReturnValue(true),
            },
        };

        Notification.findById.mockResolvedValue(mockNotif);
        Notification.findByIdAndUpdate.mockResolvedValue(updated);

        await updateNotification(req, res);

        expect(Notification.findById).toHaveBeenCalledWith('notif123');

        expect(Notification.findByIdAndUpdate).toHaveBeenCalledWith(
            'notif123',
            { read: true },
            { returnDocument: 'after' },
        );

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(updated);
    });

    it('should handle server error', async () => {
        Notification.findById.mockRejectedValue(new Error('DB crash'));

        await updateNotification(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Something went wrong! Please try again later',
        });

        expect(console.log).toHaveBeenCalled();
    });
});
