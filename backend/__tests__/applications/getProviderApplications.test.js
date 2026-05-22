const Application = require('../../applications/Applications.js');
const Opportunity = require('../../opportunities/Opportunity.js');
const { getProviderApplications } = require('../../applications/controller.js');

jest.mock('../../applications/Applications.js', () => ({
    find: jest.fn(),
}));

jest.mock('../../opportunities/Opportunity.js', () => ({
    find: jest.fn(),
}));

describe('Get Provider Applications', () => {
    let req;
    let res;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            user: {
                _id: 'creator123',
            },
            query: {},
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        console.error = jest.fn();
    });

    it('should return 401 if not authenticated', async () => {
        req.user = null;

        await getProviderApplications(req, res);

        expect(res.status).toHaveBeenCalledWith(401);

        expect(res.json).toHaveBeenCalledWith({
            error: 'Not authenticated',
        });

        expect(Opportunity.find).not.toHaveBeenCalled();
    });

    it('should return provider applications without status filter', async () => {
        const mockOpportunities = [{ _id: 'opp1' }, { _id: 'opp2' }];

        const mockApplications = [
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
                    stipend: '5000',
                    duration: '3 months',
                },
            },
        ];

        Opportunity.find.mockResolvedValue(mockOpportunities);

        Application.find.mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockResolvedValue(mockApplications),
        });

        await getProviderApplications(req, res);

        expect(Opportunity.find).toHaveBeenCalledWith({
            creator: 'creator123',
        });

        expect(Application.find).toHaveBeenCalledWith({
            opportunity: { $in: ['opp1', 'opp2'] },
        });

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            count: mockApplications.length,
            applications: mockApplications,
        });
    });

    it('should include status filter when provided', async () => {
        req.query = { status: 'Pending' };

        Opportunity.find.mockResolvedValue([{ _id: 'opp1' }]);

        Application.find.mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockResolvedValue([]),
        });

        await getProviderApplications(req, res);

        expect(Application.find).toHaveBeenCalledWith({
            opportunity: { $in: ['opp1'] },
            status: 'Pending',
        });

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            count: 0,
            applications: [],
        });
    });

    it('should return empty when no opportunities exist', async () => {
        Opportunity.find.mockResolvedValue([]);

        Application.find.mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockResolvedValue([]),
        });

        await getProviderApplications(req, res);

        expect(Application.find).toHaveBeenCalledWith({
            opportunity: { $in: [] },
        });

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            count: 0,
            applications: [],
        });
    });

    it('should handle server error', async () => {
        Opportunity.find.mockRejectedValue(new Error('DB crash'));

        await getProviderApplications(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: 'Something went wrong! Please try again later',
        });

        expect(console.error).toHaveBeenCalled();
    });
});
