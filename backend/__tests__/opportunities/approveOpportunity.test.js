const controller = require('../../opportunities/controller.js');
const Opportunity = require('../../opportunities/Opportunity.js');

jest.mock('../../opportunities/Opportunity.js', () => ({
    findById: jest.fn(),
}));

describe('Reject Opportunity', () => {
    it('should return a 400 status when there are no params', async () => {
        // Mock request object
        const req = {};

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.approveOpportunity(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return an object with an error property when there are no params', async () => {
        // Mock request object
        const req = {};

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.approveOpportunity(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });

    it('should return a 400 status when params do not have an id property', async () => {
        // Mock request object
        const req = { params: {} };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.approveOpportunity(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return an object with an error property when params do not have an id property', async () => {
        // Mock request object
        const req = { params: {} };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.approveOpportunity(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });

    it('should not return an object with an error property when params do not have an id property', async () => {
        // Mock request object
        const req = { params: {} };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.approveOpportunity(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });

    it('should call the Opportunity.findById method when params have an id property', async () => {
        // Mock request object
        const req = { params: { id: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.approveOpportunity(req, res);
        expect(Opportunity.findById).toHaveBeenCalled();
    });

    it('should use the correct param id to fetch opportunity details', async () => {
        // Mock request object
        const req = { params: { id: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.approveOpportunity(req, res);
        // Opportunity gets mocked so we are not using the schema object
        expect(Opportunity.findById).toHaveBeenCalledWith(req.params.id);
    });

    it('should return a 400 status when the opportunity is not found', async () => {
        // Opportunity gets mocked, hence the mockResolvedValue function exists
        Opportunity.findById.mockResolvedValue(undefined);

        // Mock request object
        const req = { params: { id: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.approveOpportunity(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return an object with an error property when the opportunity is not found', async () => {
        // Opportunity gets mocked, hence the mockResolvedValue function exists
        Opportunity.findById.mockResolvedValue(undefined);

        // Mock request object
        const req = { params: { id: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.approveOpportunity(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });

    // TODO: Test if the status does get changed
    it('should return a 200 status on success', async () => {
        // Opportunity gets mocked, hence the mockResolvedValue function exists
        Opportunity.findById.mockResolvedValue({ status: 'Pending', save: jest.fn() });

        // Mock request object
        const req = { params: { id: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.approveOpportunity(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return a 500 status on error', async () => {
        // Opportunity gets mocked, hence the mockRejectedValue function exists
        Opportunity.findById.mockRejectedValue(new Error('Test error'));

        // Mock request object
        const req = { params: { id: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.approveOpportunity(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should return an object with an error property on error', async () => {
        // Opportunity gets mocked, hence the mockRejectedValue function exists
        Opportunity.findById.mockRejectedValue(new Error('Test error'));

        // Mock request object
        const req = { query: {} };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.approveOpportunity(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });
});
