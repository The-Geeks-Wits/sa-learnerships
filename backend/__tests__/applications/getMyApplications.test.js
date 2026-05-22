const Application = require('../../applications/Applications.js');
const Opportunity = require('../../opportunities/Opportunity.js');
const { getMyApplications } = require('../../applications/controller.js');

jest.mock('../../applications/Applications.js', () => ({
    find: jest.fn(),
}));

jest.mock('../../opportunities/Opportunity.js', () => ({
    findById: jest.fn(),
}));

describe('Get My Applications', () => {
    let req;
    let res;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            user: {
                _id: 'user123',
            },
            query: {},
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        console.log = jest.fn();
    });

    it('should return 400 if user is missing', async () => {
        req.user = null;

        await getMyApplications(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            error: 'Creator required! Please provide the creator of opportunities',
        });

        expect(Application.find).not.toHaveBeenCalled();
    });

    it('should return applications without status filter and populate opportunities', async () => {
        const mockApplications = [
            {
                opportunity: 'opp1',
                toObject: jest.fn().mockReturnValue({
                    _id: 'app1',
                    opportunity: 'opp1',
                }),
            },
            {
                opportunity: 'opp2',
                toObject: jest.fn().mockReturnValue({
                    _id: 'app2',
                    opportunity: 'opp2',
                }),
            },
        ];

        Application.find.mockResolvedValue(mockApplications);

        Opportunity.findById
            .mockResolvedValueOnce({
                toObject: () => ({ _id: 'opp1', title: 'Job 1' }),
            })
            .mockResolvedValueOnce({
                toObject: () => ({ _id: 'opp2', title: 'Job 2' }),
            });

        await getMyApplications(req, res);

        expect(Application.find).toHaveBeenCalledWith({
            applicant: 'user123',
        });

        expect(Opportunity.findById).toHaveBeenCalledTimes(2);

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            applications: [
                {
                    _id: 'app1',
                    opportunity: { _id: 'opp1', title: 'Job 1' },
                },
                {
                    _id: 'app2',
                    opportunity: { _id: 'opp2', title: 'Job 2' },
                },
            ],
        });
    });

    it('should include status filter in query', async () => {
        req.query = { status: 'pending' };

        Application.find.mockResolvedValue([]);

        await getMyApplications(req, res);

        expect(Application.find).toHaveBeenCalledWith({
            applicant: 'user123',
            status: 'pending',
        });

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            applications: [],
        });
    });

    it('should return 500 on error', async () => {
        Application.find.mockRejectedValue(new Error('DB error'));

        await getMyApplications(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: 'Something went wrong! Please try again later',
        });

        expect(console.log).toHaveBeenCalled();
    });
});
