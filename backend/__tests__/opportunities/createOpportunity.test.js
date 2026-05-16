const controller = require('../../opportunities/controller.js');
const Opportunity = require('../../opportunities/Opportunity.js');

jest.mock('../../opportunities/Opportunity.js', () => ({
    create: jest.fn(),
}));

describe('Create Opportunity', () => {
    it('should return a 400 status when there is no request body', async () => {
        // Mock request object
        const req = {};

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.createOpportunity(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return an object with an error property when there is no request body', async () => {
        // Mock request object
        const req = {};

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.createOpportunity(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });

    it('should return a 400 status when there is no title in the body object', async () => {
        // Mock request object
        const req = { body: {} };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.createOpportunity(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return an object with an error property when there is no title in the body object', async () => {
        // Mock request object
        const req = { body: {} };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.createOpportunity(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });

    it('should return a 400 status when there is no closingDate in the body object', async () => {
        // Mock request object
        const req = { body: { title: 'test-title' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.createOpportunity(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return an object with an error property when there is no closingDate in the body object', async () => {
        // Mock request object
        const req = { body: { title: 'test-title' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.createOpportunity(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });

    it('should call the Opportunity.create method when all fields are provided', async () => {
        // Mock request object
        const req = { user: { _id: 'test-id' }, body: { title: 'test-title', closingDate: 'test-date' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.createOpportunity(req, res);
        expect(Opportunity.create).toHaveBeenCalled();
    });

    it('should return a 500 status when the opportunity was not returned', async () => {
        // Opportunity gets mocked, hence the mockResolvedValue function exists
        Opportunity.create.mockResolvedValue(undefined);

        // Mock request object
        const req = { user: { _id: 'test-id' }, body: { title: 'test-title', closingDate: 'test-date' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.createOpportunity(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should return an object with an error property when the opportunity is not found', async () => {
        // Opportunity gets mocked, hence the mockResolvedValue function exists
        Opportunity.create.mockResolvedValue(undefined);

        // Mock request object
        const req = { user: { _id: 'test-id' }, body: { title: 'test-title', closingDate: 'test-date' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.createOpportunity(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });

    it('should return a 201 status on success', async () => {
        // Opportunity gets mocked, hence the mockResolvedValue function exists
        Opportunity.create.mockResolvedValue({});

        // Mock request object
        const req = { user: { _id: 'test-id' }, body: { title: 'test-title', closingDate: 'test-date' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.createOpportunity(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return a 500 status on error', async () => {
        // Opportunity gets mocked, hence the mockRejectedValue function exists
        Opportunity.create.mockRejectedValue(new Error('Test error'));

        // Mock request object
        const req = { user: { _id: 'test-id' }, body: { title: 'test-title', closingDate: 'test-date' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.createOpportunity(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should return an object with an error property on error', async () => {
        // Opportunity gets mocked, hence the mockRejectedValue function exists
        Opportunity.create.mockRejectedValue(new Error('Test error'));

        // Mock request object
        const req = { user: { _id: 'test-id' }, body: { title: 'test-title', closingDate: 'test-date' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.createOpportunity(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });
});
