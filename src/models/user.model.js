import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		default: 'Mô tả về bản thân',
	},
	avatar_url: {
		type: String,
		default: 'https://seud.org/wp-content/uploads/2020/06/avatar-nobody.png',
	},
	address: {
		type: String,
		default: 'Hà Nội, Việt Nam',
	},
	status: {
		type: String,
		default: 'active',
	},
	roles: [
		{
			type: mongoose.Types.ObjectId,
			ref: 'Role',
		},
	],
	phone: {
		type: String,
		default: '0967999999',
	},
	birthday: Date,
});

export const UserModel = mongoose.model('User', userSchema);
