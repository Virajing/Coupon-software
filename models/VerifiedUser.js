<<<<<<< HEAD
const mongoose = require('mongoose');

const verifySchema = new mongoose.Schema({
    registration_number: {
        type: String,
        required: true
    },
    password: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('verify', verifySchema);
=======
const mongoose = require('mongoose');

const verifySchema = new mongoose.Schema({
    registration_number: {
        type: String,
        required: true
    },
    password: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('verify', verifySchema);
>>>>>>> 36f576dcaab08e56c21f73781b10a3a9e99ac19f
