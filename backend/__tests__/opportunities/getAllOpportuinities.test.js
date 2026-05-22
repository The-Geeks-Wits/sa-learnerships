const controller = require('../../opportunities/controller.js');
const Opportunity = require('../../opportunities/Opportunity.js');

jest.mock('../../opportunities/Opportunity.js', () => ({
    find: jest.fn(),
}));

describe('Get All Opportunitites', () => {
    beforeEach(() => {
        console.log = jest.fn();
    });

    // Opportunity gets mocked, hence the mockResolvedValue function exists
    Opportunity.find.mockResolvedValue([{ title: 'A buff opportunity' }]);

    it('should return a 400 status when there are no query params', async () => {
        // Mock request object
        const req = {};

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getAllOpportunities(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return an object with an error property when there are no query params', async () => {
        // Mock request object
        const req = {};

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getAllOpportunities(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });

    it("should return a 400 status when query params don't have a status property", async () => {
        // Mock request object
        const req = { query: {} };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getAllOpportunities(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return an object with an error property when query params don't have a status property", async () => {
        // Mock request object
        const req = { query: {} };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getAllOpportunities(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });

    it('should not return a 400 status when the status query param is provided', async () => {
        // Mock request object
        const req = {
            query: { status: 'Pending' },
        };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getAllOpportunities(req, res);
        expect(res.status).not.toHaveBeenCalledWith(400);
    });

    it('should call the Opportunity.find method when the status query param is provided', async () => {
        // Mock request object
        const req = { query: {} };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getAllOpportunities(req, res);
        expect(Opportunity.find).toHaveBeenCalled();
    });

    it('should return a 200 status on success', async () => {
        // Mock request object
        const req = { query: { status: 'Pending' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getAllOpportunities(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return an opportunitites property on success', async () => {
        // Mock request object
        const req = { query: { status: 'Pending' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getAllOpportunities(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.opportunities).toBeDefined();
    });

    it('should not return an object with an error property on success', async () => {
        // Mock request object
        const req = { query: { status: 'Pending' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getAllOpportunities(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).not.toBeDefined();
    });

    it('should return a 500 status on error', async () => {
        // Opportunity gets mocked, hence the mockRejectedValue function exists
        Opportunity.find.mockRejectedValue(new Error('Test error'));

        // Mock request object
        const req = { query: { status: 'Pending' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getAllOpportunities(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should return an object with an error property on error', async () => {
        // Opportunity gets mocked, hence the mockRejectedValue function exists
        Opportunity.find.mockRejectedValue(new Error('Test error'));

        // Mock request object
        const req = { query: {} };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getAllOpportunities(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });
});
