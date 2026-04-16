const controller = require('../../opportunities/controller.js');

jest.mock('../../opportunities/Opportunity.js', () => ({
    find: jest.fn().mockResolvedValue([{ title: 'A buff opportunity' }]),
}));

describe('Get All Opportunitites', () => {
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

    it('should return a 200 status on success', async () => {
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
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return an opportunitites property on success', async () => {
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
        const json = res.json.mock.calls[0][0];
        expect(json.opportunities).toBeDefined();
    });
});
