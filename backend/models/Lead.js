const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    company: {
        type: String,
        required: [true, 'Please add a company']
    },
    email: {
        type: String,
        required: [true, 'Please add an email']
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Qualified', 'Won', 'Lost'],
        default: 'New'
    },
    priority: {
        type: String,
        enum: ['Hot', 'Warm', 'Cold'],
        default: 'Warm'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Lead', LeadSchema);
