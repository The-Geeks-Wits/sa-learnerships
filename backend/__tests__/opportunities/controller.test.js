const controller = require('../../opportunities/controller.js');
const Opportunity = require('../../opportunities/Opportunity.js');

jest.mock('../../opportunities/Opportunity.js', () => ({
    find: jest.fn(),
    findById: jest.fn(),
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
        const req = { body: { title: 'test-title', closingDate: 'test-date' } };

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
        const req = { body: { title: 'test-title', closingDate: 'test-date' } };

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
        const req = { body: { title: 'test-title', closingDate: 'test-date' } };

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
        const req = { body: { title: 'test-title', closingDate: 'test-date' } };

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
        const req = { body: { title: 'test-title', closingDate: 'test-date' } };

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
        const req = { body: { title: 'test-title', closingDate: 'test-date' } };

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

describe('Get All Opportunitites', () => {
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

describe('Get Opportunity', () => {
    it('should return a 400 status when there are no params', async () => {
        // Mock request object
        const req = {};

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getOpportunity(req, res);
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

        await controller.getOpportunity(req, res);
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

        await controller.getOpportunity(req, res);
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

        await controller.getOpportunity(req, res);
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

        await controller.getOpportunity(req, res);
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

        await controller.getOpportunity(req, res);
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

        await controller.getOpportunity(req, res);
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

        await controller.getOpportunity(req, res);
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

        await controller.getOpportunity(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });

    it('should return a 200 status on success', async () => {
        // Opportunity gets mocked, hence the mockResolvedValue function exists
        Opportunity.findById.mockResolvedValue({});

        // Mock request object
        const req = { params: { id: 'test-id' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.getOpportunity(req, res);
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

        await controller.getOpportunity(req, res);
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

        await controller.getOpportunity(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });
});
