const mongoose = require('mongoose');
const Opportunity = require('../../opportunities/Opportunity.js');

jest.mock('mongoose', () => {
    const mockSchema = jest.fn(() => ({
        Types: {
            ObjectId: jest.fn(),
        },
    }));

    mockSchema.Types = {
        ObjectId: jest.fn(),
    };

    return {
        Schema: mockSchema,
        model: jest.fn(),
        Types: {
            ObjectId: jest.fn(),
        },
    };
});

describe('Opportunity Schema', () => {
    it('gets created', () => {
        const mockSchema = mongoose.Schema;
        expect(mockSchema).toHaveBeenCalled();
        expect(mockSchema).toHaveBeenCalledTimes(1);

        const mockModel = mongoose.model;
        expect(mockModel).toHaveBeenCalled();

        const passedSchema = mockModel.mock.calls[0][1];
        expect(mockModel).toHaveBeenCalledWith('Opportunity', passedSchema);
    });
});
