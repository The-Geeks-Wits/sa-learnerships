const Application = require('../../applications/Applications.js');
const Opportunity = require('../../opportunities/Opportunity.js');
const { getAllApplications } = require('../../applications/controller.js');

jest.mock('../../applications/Applications.js', () => ({
    find: jest.fn(),
}));

jest.mock('../../opportunities/Opportunity.js', () => ({
    find: jest.fn(),
}));

describe('Get All Applications', () => {
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

        console.log = jest.fn();
    });

    it('should return 400 if user is missing', async () => {
        req.user = null;

        await getAllApplications(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            error: 'Creator required! Please provide the creator of opportunities',
        });

        expect(Opportunity.find).not.toHaveBeenCalled();
    });

    it('should return grouped applications per opportunity', async () => {
        const mockOpportunities = [
            {
                _id: 'opp1',
                toObject: jest.fn().mockReturnValue({
                    _id: 'opp1',
                    title: 'Job 1',
                }),
            },
            {
                _id: 'opp2',
                toObject: jest.fn().mockReturnValue({
                    _id: 'opp2',
                    title: 'Job 2',
                }),
            },
        ];

        const opp1Apps = [
            {
                toObject: jest.fn().mockReturnValue({
                    _id: 'app1',
                }),
            },
        ];

        const opp2Apps = [
            {
                toObject: jest.fn().mockReturnValue({
                    _id: 'app2',
                }),
            },
            {
                toObject: jest.fn().mockReturnValue({
                    _id: 'app3',
                }),
            },
        ];

        Opportunity.find.mockResolvedValue(mockOpportunities);

        Application.find.mockResolvedValueOnce(opp1Apps).mockResolvedValueOnce(opp2Apps);

        await getAllApplications(req, res);

        expect(Opportunity.find).toHaveBeenCalledWith({
            creator: 'creator123',
        });

        expect(Application.find).toHaveBeenCalledTimes(2);

        expect(Application.find).toHaveBeenCalledWith({ opportunity: 'opp1' });
        expect(Application.find).toHaveBeenCalledWith({ opportunity: 'opp2' });

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            applications: [
                [
                    {
                        _id: 'app1',
                        opportunity: {
                            _id: 'opp1',
                            title: 'Job 1',
                        },
                    },
                ],
                [
                    {
                        _id: 'app2',
                        opportunity: {
                            _id: 'opp2',
                            title: 'Job 2',
                        },
                    },
                    {
                        _id: 'app3',
                        opportunity: {
                            _id: 'opp2',
                            title: 'Job 2',
                        },
                    },
                ],
            ],
        });
    });

    it('should return empty applications array when no opportunities exist', async () => {
        Opportunity.find.mockResolvedValue([]);

        await getAllApplications(req, res);

        expect(Application.find).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            applications: [],
        });
    });

    it('should return 500 on error', async () => {
        Opportunity.find.mockRejectedValue(new Error('DB error'));

        await getAllApplications(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: 'Something went wrong! Please try again later',
        });

        expect(console.log).toHaveBeenCalled();
    });
});
