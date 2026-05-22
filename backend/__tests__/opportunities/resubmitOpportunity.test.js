const Opportunity = require('../../opportunities/Opportunity.js');
const { resubmitOpportunity } = require('../../opportunities/controller.js');

jest.mock('../../opportunities/Opportunity.js', () => ({
    findById: jest.fn(),
}));

describe('Resubmit Opportunity', () => {
    let req;
    let res;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            params: {
                id: 'opp123',
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        console.log = jest.fn();
    });

    it('should return 400 if opportunity id is missing', async () => {
        req.params = {};

        await resubmitOpportunity(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Opportunity id required! Please provide a valid opportunity id',
        });

        expect(Opportunity.findById).not.toHaveBeenCalled();
    });

    it('should return 400 if opportunity not found', async () => {
        Opportunity.findById.mockResolvedValue(null);

        await resubmitOpportunity(req, res);

        expect(Opportunity.findById).toHaveBeenCalledWith('opp123');

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Opportunity not found! Please check your id and try again',
        });
    });

    it('should resubmit opportunity successfully', async () => {
        const saveMock = jest.fn();

        const mockOpportunity = {
            status: 'Rejected',
            save: saveMock,
        };

        Opportunity.findById.mockResolvedValue(mockOpportunity);

        await resubmitOpportunity(req, res);

        expect(mockOpportunity.status).toBe('Pending');
        expect(saveMock).toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Opportunity re-submitted successfully!',
        });
    });

    it('should handle server error', async () => {
        Opportunity.findById.mockRejectedValue(new Error('DB crash'));

        await resubmitOpportunity(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Something went wrong! Please try again later',
        });

        expect(console.log).toHaveBeenCalled();
    });
});
