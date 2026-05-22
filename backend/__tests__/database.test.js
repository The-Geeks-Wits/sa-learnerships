const mongoose = require('mongoose');
const connectDatabase = require('../database');

jest.mock('mongoose', () => ({
    connect: jest.fn(),
}));

jest.spyOn(process, 'exit').mockImplementation((code) => {
    console.log('Process will stop running');
});

describe('Database Connection', () => {
    beforeEach(() => {
        console.log = jest.fn();
        console.error = jest.fn();
    });

    process.env.DB_URI = 'test-uri';
    it('should connect to the database', async () => {
        await connectDatabase();
        expect(mongoose.connect).toHaveBeenCalledWith(process.env.DB_URI);
    });

    it('should catch the exception', async () => {
        mongoose.connect.mockRejectedValue(new Error('Test error'));
        await connectDatabase();
    });
});
