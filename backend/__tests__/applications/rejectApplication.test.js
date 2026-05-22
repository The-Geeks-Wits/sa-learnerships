const Application = require('../../applications/Applications.js');
const { sendNotification } = require('../../notifications/controller.js');
const { rejectApplication } = require('../../applications/controller.js');

jest.mock('../../applications/Applications.js', () => ({
    findById: jest.fn(),
}));

jest.mock('../../notifications/controller.js', () => ({
    sendNotification: jest.fn(),
}));

describe('Reject Application', () => {
    let req;
    let res;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            params: { id: 'app123' },
            user: {
                _id: 'creator123',
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        console.error = jest.fn();
        console.log = jest.fn();
    });

    it('should return 401 if not authenticated', async () => {
        req.user = null;

        await rejectApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(401);

        expect(res.json).toHaveBeenCalledWith({
            error: 'Not authenticated',
        });

        expect(Application.findById).not.toHaveBeenCalled();
    });

    it('should return 404 if application not found', async () => {
        Application.findById.mockReturnValue({
            populate: jest.fn().mockResolvedValue(null),
        });

        await rejectApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(404);

        expect(res.json).toHaveBeenCalledWith({
            error: 'Application not found',
        });
    });

    it('should return 403 if user is not creator of opportunity', async () => {
        Application.findById.mockReturnValue({
            populate: jest.fn().mockResolvedValue({
                opportunity: {
                    creator: {
                        toString: () => 'otherUser',
                    },
                },
            }),
        });

        await rejectApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(403);

        expect(res.json).toHaveBeenCalledWith({
            error: 'You can only reject applications for your own opportunities',
        });
    });

    it('should return 400 if application is already processed', async () => {
        Application.findById.mockReturnValue({
            populate: jest.fn().mockResolvedValue({
                opportunity: {
                    creator: {
                        toString: () => 'creator123',
                    },
                    title: 'Software Engineer',
                },
                status: 'Accepted',
            }),
        });

        await rejectApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            error: 'This application has already been accepted',
        });
    });

    it('should reject application successfully and send notification', async () => {
        const saveMock = jest.fn();

        Application.findById.mockReturnValue({
            populate: jest.fn().mockResolvedValue({
                _id: 'app123',
                applicant: 'user999',
                status: 'Pending',
                save: saveMock,
                opportunity: {
                    title: 'Software Engineer',
                    creator: {
                        toString: () => 'creator123',
                    },
                },
            }),
        });

        await rejectApplication(req, res);

        expect(saveMock).toHaveBeenCalled();

        expect(sendNotification).toHaveBeenCalledWith(
            'user999',
            'Application Update - Software Engineer',
            'Your application for Software Engineer has been reviewed carefully. Unfortunately, it was not selected at this time.',
        );

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Application rejected successfully',
            application: {
                id: 'app123',
                status: 'Rejected',
                opportunity: 'Software Engineer',
            },
        });
    });

    it('should handle notification failure silently', async () => {
        const saveMock = jest.fn();

        sendNotification.mockRejectedValue(new Error('Notification failed'));

        Application.findById.mockReturnValue({
            populate: jest.fn().mockResolvedValue({
                _id: 'app123',
                applicant: 'user999',
                status: 'Pending',
                save: saveMock,
                opportunity: {
                    title: 'Software Engineer',
                    creator: {
                        toString: () => 'creator123',
                    },
                },
            }),
        });

        await rejectApplication(req, res);

        expect(saveMock).toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
            }),
        );
    });

    it('should return 500 on unexpected error', async () => {
        Application.findById.mockImplementation(() => {
            throw new Error('DB crash');
        });

        await rejectApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: 'Something went wrong! Please try again later',
            }),
        );

        expect(console.error).toHaveBeenCalled();
    });
});
