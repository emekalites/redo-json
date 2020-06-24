const redoJson = require('./index.js');

var chai = require('chai'),
	expect = chai.expect;

const input = '{message: Transaction, reference: null, status: false, method: card, verify: false, card: {expiryMonth: 1, expiryYear: 01, _type: VERVE, _last4Digits: 7812, _number: null}}';
const expectedJSON = {
	message: 'Transaction',
	reference: null,
	status: false,
	method: 'card',
	verify: false,
	card: {
		expiryMonth: 1,
		expiryYear: '01',
		_type: 'VERVE',
		_last4Digits: 7812,
		_number: null,
	},
};

describe('json fix test', function () {
	it('should return return an object', function () {
		const parsed = redoJson.parse(input);
		expect(parsed).to.be.an('object');
	});

	it("should be equal to 'expected' object", function () {
		const parsed = redoJson.parse(input);
		expect(parsed).to.be.deep.equal(expectedJSON);
	});
});
