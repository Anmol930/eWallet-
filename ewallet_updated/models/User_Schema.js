const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User_Schema =
	new Schema(
		{
			name: {
				type: String
			},
			phone: {
				type: String
			},
            password: {
				type: String
			},
		},
		{
			collection: 'user'
		})
		User_Schema.set('timestamps', true);
module.exports = mongoose.model('user', User_Schema);