const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    displayName: { type: String, required: true },
    email: {type: String, lowercase: true, unique: true, required: [true, 'can\'t be blank'], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
    username: { type: String, required: true },
    id: { type: String, required: true },
    provider: { type: String, required: true },
    avatar: { type: String, required: true },
    accessToken: { type: String, required: false },
    refreshToken: { type: String, required: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('User',schema);
