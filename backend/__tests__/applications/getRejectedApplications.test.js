const Application = require('../../applications/Applications.js');
const Opportunity = require('../../opportunities/Opportunity.js');
const { getRejectedApplications } = require('../../applications/controller.js');

jest.mock('../../applications/Applications.js', () => ({
    find: jest.fn(),
}));

jest.mock('../../opportunities/Opportunity.js', () => ({
    find: jest.fn(),
}));

describe('Get Rejected Applications', () => {
    let req;
    let res;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            user: {
                _id: 'creator123',
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        console.error = jest.fn();
    });

    it('should return 401 if user is not authenticated', async () => {
        req.user = null;

        await getRejectedApplications(req, res);

        expect(res.status).toHaveBeenCalledWith(401);

        expect(res.json).toHaveBeenCalledWith({
            error: 'Not authenticated',
        });

        expect(Opportunity.find).not.toHaveBeenCalled();
    });

    it('should return rejected applications successfully', async () => {
        const mockOpportunities = [{ _id: 'opp1' }, { _id: 'opp2' }];

        const mockRejectedApps = [
            {
                _id: 'app1',
                applicant: {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@mail.com',
                    phone: '123',
                },
                opportunity: {
                    title: 'Job 1',
                    description: 'Desc',
                    closingDate: '2026-01-01',
                },
            },
        ];

        Opportunity.find.mockResolvedValue(mockOpportunities);

        Application.find.mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockResolvedValue(mockRejectedApps),
        });

        await getRejectedApplications(req, res);

        expect(Opportunity.find).toHaveBeenCalledWith({
            creator: 'creator123',
        });

        expect(Application.find).toHaveBeenCalledWith({
            opportunity: { $in: ['opp1', 'opp2'] },
            status: 'Rejected',
        });

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            count: mockRejectedApps.length,
            applications: mockRejectedApps,
        });
    });

    it('should return empty list when no rejected applications exist', async () => {
        Opportunity.find.mockResolvedValue([]);

        Application.find.mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockResolvedValue([]),
        });

        await getRejectedApplications(req, res);

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            count: 0,
            applications: [],
        });
    });

    it('should return 500 on error', async () => {
        Opportunity.find.mockRejectedValue(new Error('DB error'));

        await getRejectedApplications(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: 'Something went wrong! Please try again later',
        });

        expect(console.error).toHaveBeenCalled();
    });
});
