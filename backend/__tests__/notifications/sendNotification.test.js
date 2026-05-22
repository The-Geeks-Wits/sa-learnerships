const Notification = require('../../notifications/Notification.js');
const { sendNotification } = require('../../notifications/controller.js');

jest.mock('../../notifications/Notification.js', () => ({
    create: jest.fn(),
}));

describe('Send Notification', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        console.log = jest.fn();
    });

    it('should create and return a notification successfully', async () => {
        const mockNotification = {
            _id: '123',
            recipient: 'user1',
            title: 'Test Title',
            message: 'Test Message',
        };

        Notification.create.mockResolvedValue(mockNotification);

        const result = await sendNotification('user1', 'Test Title', 'Test Message');

        expect(Notification.create).toHaveBeenCalledTimes(1);
        expect(Notification.create).toHaveBeenCalledWith({
            recipient: 'user1',
            title: 'Test Title',
            message: 'Test Message',
        });

        expect(result).toEqual(mockNotification);
    });

    it('should throw an error if recipient is missing', async () => {
        await expect(sendNotification('', 'Test Title', 'Test Message')).rejects.toThrow(
            'All notification details are required',
        );

        expect(Notification.create).not.toHaveBeenCalled();
    });

    it('should throw an error if title is missing', async () => {
        await expect(sendNotification('user1', '', 'Test Message')).rejects.toThrow(
            'All notification details are required',
        );

        expect(Notification.create).not.toHaveBeenCalled();
    });

    it('should throw an error if message is missing', async () => {
        await expect(sendNotification('user1', 'Test Title', '')).rejects.toThrow(
            'All notification details are required',
        );

        expect(Notification.create).not.toHaveBeenCalled();
    });

    it('should throw an error if Notification.create returns null', async () => {
        Notification.create.mockResolvedValue(null);

        await expect(sendNotification('user1', 'Test Title', 'Test Message')).rejects.toThrow(
            'All notification details are required',
        );

        expect(Notification.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if Notification.create returns undefined', async () => {
        Notification.create.mockResolvedValue(undefined);

        await expect(sendNotification('user1', 'Test Title', 'Test Message')).rejects.toThrow(
            'All notification details are required',
        );

        expect(Notification.create).toHaveBeenCalledTimes(1);
    });
});
