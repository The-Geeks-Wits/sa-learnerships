const mongoose = require('mongoose');
const User = require('../../authorization/User.js');

jest.mock('mongoose', () => ({ Schema: jest.fn(() => ({})), model: jest.fn() }));

describe('User Schema', () => {
    // TODO: Test line 12 on the User schema
    it('gets created', () => {
        const mockSchema = mongoose.Schema;
        expect(mockSchema).toHaveBeenCalled();
        expect(mockSchema).toHaveBeenCalledTimes(1);

        const mockModel = mongoose.model;
        expect(mockModel).toHaveBeenCalled();
        expect(mockModel).toHaveBeenCalledWith('User', mockSchema());
    });
});
