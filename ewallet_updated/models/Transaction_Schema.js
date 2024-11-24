const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Transaction_Schema =
	new Schema(
		{
			phone: {
				type: String
			},
			details: {
				type: String
			},
            amount: {
				type: String
			},
            type: {
				type: String
			},
			wallet: {
				type: String
			},
			
		},
		{
			collection: 'transaction'
		})
		Transaction_Schema.set('timestamps', true);
module.exports = mongoose.model('transaction', Transaction_Schema);