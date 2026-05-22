const Application = require('../../applications/Applications.js');
const Opportunity = require('../../opportunities/Opportunity.js');
const { sendNotification } = require('../../notifications/controller.js');
const { submitApplication } = require('../../applications/controller.js');

jest.mock('../../applications/Applications.js', () => ({
    findOne: jest.fn(),
    create: jest.fn(),
}));

jest.mock('../../opportunities/Opportunity.js', () => ({
    findById: jest.fn(),
}));

jest.mock('../../notifications/controller.js', () => ({
    sendNotification: jest.fn(),
}));

describe('Submit Application', () => {
    let req;
    let res;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            user: { _id: 'user123', firstName: 'John' },
            body: { opportunityId: 'opp123' },
        };

        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        console.log = jest.fn();
    });

    it('should return 401 if user is not logged in', async () => {
        req.user = null;

        await submitApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: 'You are not logged in! Please log in to continue',
        });
    });

    it('should return 401 if user id is missing', async () => {
        req.user = {};

        await submitApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: 'You are not logged in! Please log in to continue',
        });
    });

    it('should return 400 if opportunityId is missing', async () => {
        req.body = {};

        await submitApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Opportunity id required! Please provide a valid opportunity id',
        });
    });

    it('should return 400 if request body is missing', async () => {
        req.body = null;

        await submitApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Opportunity id required! Please provide a valid opportunity id',
        });
    });

    it('should return 400 if opportunity does not exist', async () => {
        Opportunity.findById.mockResolvedValue(null);

        await submitApplication(req, res);

        expect(Opportunity.findById).toHaveBeenCalledWith('opp123');

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Opportunity not found! Please check your id and try again',
        });
    });

    it('should return 400 if application already exists', async () => {
        Opportunity.findById.mockResolvedValue({
            _id: 'opp123',
            title: 'Software Engineer',
        });

        Application.findOne.mockResolvedValue({
            _id: 'app123',
        });

        await submitApplication(req, res);

        expect(Application.findOne).toHaveBeenCalledWith({
            applicant: 'user123',
            opportunity: 'opp123',
        });

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'You have already applied for this opportunity',
        });
    });

    it('should create application successfully', async () => {
        const mockOpportunity = {
            _id: 'opp123',
            title: 'Software Engineer',
        };

        const mockApplication = {
            _id: 'app123',
            applicant: 'user123',
            opportunity: 'opp123',
            status: 'pending',
            createdAt: '2026-05-17',
        };

        Opportunity.findById.mockResolvedValue(mockOpportunity);

        Application.findOne.mockResolvedValue(null);

        Application.create.mockResolvedValue(mockApplication);

        await submitApplication(req, res);

        expect(Application.create).toHaveBeenCalledWith({
            applicant: 'user123',
            opportunity: 'opp123',
        });

        expect(sendNotification).toHaveBeenCalledWith(
            'user123',
            'Application Received - Thank You John',
            "We're pleased to confirm the receipt of your application for the Software Engineer opportunity.",
        );

        expect(res.status).toHaveBeenCalledWith(201);

        expect(res.json).toHaveBeenCalledWith({
            id: 'app123',
            applicant: 'user123',
            opportunity: 'opp123',
            status: 'pending',
            createdAt: '2026-05-17',
        });
    });

    it('should return 500 if an exception occurs', async () => {
        Opportunity.findById.mockRejectedValue(new Error('Database error'));

        await submitApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: 'Something went wrong! Please try again later',
        });

        expect(console.log).toHaveBeenCalled();
    });
});
