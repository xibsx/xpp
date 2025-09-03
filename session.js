const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: false
    },
    scanId: {
        type: String,
        required: false
    },
    pairingCode: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // 24 hours in seconds
    },
    status: {
        type: String,
        enum: ['active', 'expired', 'used'],
        default: 'active'
    },
    method: {
        type: String,
        enum: ['qr', 'pair'],
        required: true
    }
});

module.exports = mongoose.model('Session', sessionSchema);