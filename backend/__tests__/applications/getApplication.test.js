const Application = require('../../applications/Applications.js');
const { getApplication } = require('../../applications/controller.js');

jest.mock('../../applications/Applications.js', () => ({
    find: jest.fn(),
}));

describe('Get Application', () => {
    let req;
    let res;

    beforeEach(() => {
        jest.clearAllMocks();

        req = { params: { id: 'opp123' } };

        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        console.log = jest.fn();
    });

    it('should return 400 if opportunity id is missing', async () => {
        req.params = {};

        await getApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            error: 'Opportunity id required! Please provide a valid opportunity id',
        });

        expect(Application.find).not.toHaveBeenCalled();
    });

    it('should return applications successfully', async () => {
        const mockApplications = [
            {
                applicant: {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                },
            },
        ];

        const populateMock = jest.fn().mockResolvedValue(mockApplications);

        Application.find.mockReturnValue({
            populate: populateMock,
        });

        await getApplication(req, res);

        expect(Application.find).toHaveBeenCalledWith({
            opportunity: 'opp123',
        });

        expect(populateMock).toHaveBeenCalledWith('applicant', 'firstName lastName email');

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            applications: mockApplications,
        });
    });

    it('should return empty applications array', async () => {
        const populateMock = jest.fn().mockResolvedValue([]);

        Application.find.mockReturnValue({
            populate: populateMock,
        });

        await getApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            applications: [],
        });
    });

    it('should return 500 if an exception occurs', async () => {
        Application.find.mockImplementation(() => {
            throw new Error('Database error');
        });

        await getApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: 'Something went wrong! Please try again later',
        });

        expect(console.log).toHaveBeenCalled();
    });
});
