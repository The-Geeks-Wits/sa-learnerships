const mongoose = require('mongoose');
const db = require('../database');

jest.mock('mongoose', () => ({
    connect: jest.fn(),
}));

jest.spyOn(process, 'exit').mockImplementation((code) => {
    console.log('Process will stop running');
});

describe('Database Connection', () => {
    process.env.DB_URI = 'test-uri';
    it('should connect to the database', async () => {
        await db.connectDatabase();
        expect(mongoose.connect).toHaveBeenCalledWith(process.env.DB_URI);
    });

    it('should catch the exception', async () => {
        mongoose.connect.mockRejectedValue(new Error('Test error'));
        await db.connectDatabase();
    });
});
