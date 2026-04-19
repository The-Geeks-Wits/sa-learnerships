const mongoose = require('mongoose');
const Opportunity = require('../../opportunities/Opportunity.js');

jest.mock('mongoose', () => ({ Schema: jest.fn(() => ({})), model: jest.fn() }));

describe('Opportunity Schema', () => {
    it('gets created', () => {
        const mockSchema = mongoose.Schema;
        expect(mockSchema).toHaveBeenCalled();
        expect(mockSchema).toHaveBeenCalledTimes(1);

        const mockModel = mongoose.model;
        expect(mockModel).toHaveBeenCalled();
        expect(mockModel).toHaveBeenCalledWith('Opportunity', mockSchema());
    });
});
