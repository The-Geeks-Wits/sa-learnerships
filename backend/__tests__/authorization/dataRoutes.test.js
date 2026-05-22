// const express = require('express');
// const routes = require('../../authorization/dataRoutes.js');

// jest.mock('express', () => {
//     const mockRouter = { get: jest.fn() };
//     return { Router: jest.fn(() => mockRouter) };
// });

// describe('Data Routes', () => {
//     it('calls the express router function', () => {
//         expect(express.Router).toHaveBeenCalled();
//     });

//     it('calls the router GET method 2 times', () => {
//         const mockRouter = express.Router();
//         expect(mockRouter.get).toHaveBeenCalledTimes(2);
//     });
// });

const express = require('express');
const router = require('../../authorization/dataRoutes.js');

jest.mock('express', () => {
    const mockRouter = { get: jest.fn() };
    return { Router: jest.fn(() => mockRouter) };
});

describe('Router', () => {
    let qualificationsHandler;
    let institutionsHandler;

    beforeAll(() => {
        const getCalls = express.Router.mock.results[0].value.get.mock.calls;

        qualificationsHandler = getCalls.find(([path]) => path === '/qualifications')[1];

        institutionsHandler = getCalls.find(([path]) => path === '/institutions')[1];
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return qualifications from app.locals', () => {
        const req = {
            app: {
                locals: {
                    qualifications: ['BSc CS', 'BEng'],
                },
            },
        };

        const res = {
            json: jest.fn(),
        };

        qualificationsHandler(req, res);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(['BSc CS', 'BEng']);
    });

    it('should return empty qualifications array', () => {
        const req = {
            app: {
                locals: {
                    qualifications: [],
                },
            },
        };

        const res = {
            json: jest.fn(),
        };

        qualificationsHandler(req, res);

        expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should return grouped institutions', () => {
        const req = {
            app: {
                locals: {
                    institutions: {
                        universities: ['UCT'],
                        universitiesOfTechnology: ['TUT'],
                        tvetColleges: ['CJC'],
                    },
                },
            },
        };

        const res = {
            json: jest.fn(),
        };

        institutionsHandler(req, res);

        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith([
            {
                label: 'Universities',
                options: ['UCT'],
            },
            {
                label: 'Universities of Technology',
                options: ['TUT'],
            },
            {
                label: 'TVET Colleges',
                options: ['CJC'],
            },
        ]);
    });

    it('should return empty institution groups', () => {
        const req = {
            app: {
                locals: {
                    institutions: {
                        universities: [],
                        universitiesOfTechnology: [],
                        tvetColleges: [],
                    },
                },
            },
        };

        const res = {
            json: jest.fn(),
        };

        institutionsHandler(req, res);

        expect(res.json).toHaveBeenCalledWith([
            {
                label: 'Universities',
                options: [],
            },
            {
                label: 'Universities of Technology',
                options: [],
            },
            {
                label: 'TVET Colleges',
                options: [],
            },
        ]);
    });
});
