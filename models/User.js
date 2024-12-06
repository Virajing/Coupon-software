<<<<<<< HEAD
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    DOB: {
        type: Date,
        required: true
    },
    aadhar_number: {
        type: String,
        required: true,
        unique: true
    },
    admission_number: { // Ensure this matches your form field
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('User', userSchema);
=======
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    DOB: {
        type: Date,
        required: true
    },
    aadhar_number: {
        type: String,
        required: true,
        unique: true
    },
    admission_number: { // Ensure this matches your form field
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('User', userSchema);
>>>>>>> 36f576dcaab08e56c21f73781b10a3a9e99ac19f
