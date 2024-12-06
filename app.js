<<<<<<< HEAD
const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const app = express();

// Set the default view engine to EJS
app.set('view engine', 'ejs');

// Connect to the main MongoDB for user data
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to main MongoDB'))
  .catch((err) => console.error('Failed to connect to main MongoDB:', err));

// Connect to the verification MongoDB
const verificationConnection = mongoose.createConnection(process.env.VERIFICATION_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

verificationConnection.once('open', () => {
  console.log('Connected to verification MongoDB');
});

verificationConnection.on('error', (err) => {
  console.error('Failed to connect to verification MongoDB:', err);
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define the main user model for user data
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  DOB: { type: Date, required: true },
  aadhar_number: { type: String, required: true },
  admission_number: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// Define the schema and model for the verification database
const verifyUserSchema = new mongoose.Schema({
  username: String,
  password: String
});
const VerifyUser = verificationConnection.model('Verify', verifyUserSchema);

// Route for initial access
app.get('/', (req, res) => {
  res.render('index');
});

// POST route to save user data to main MongoDB
app.post('/', (req, res) => {
  const { name, DOB, aadhar_number, admission_number } = req.body;

  if (!name || !DOB || !aadhar_number || !admission_number) {
    return res.status(400).render('index', { message: 'All fields are required', error: true });
  }

  // Save user data to main database
  User.create({
    name: name,
    DOB: DOB,
    aadhar_number: aadhar_number,
    admission_number: admission_number
  })
    .then(() => {
      console.log('User data saved successfully');
      res.status(200).redirect('/verify');
    })
    .catch((err) => {
      console.error('Error saving user data:', err);
      res.status(500).render('index', { message: 'An error occurred while saving data', error: true });
    });
});

// Route for verification
app.get('/verify', (req, res) => {
  res.render('verify');
});

// POST route to verify user and insert data into verification MongoDB
app.post('/verify', async (req, res) => {
    const { username: submittedUsername, password } = req.body;

    if (!password) {
        return res.status(400).send('Password is required');
    }

    try {
        // Search for the user in the verification database using the renamed variable
        const foundUser = await VerifyUser.findOne({ username: submittedUsername });

        if (foundUser) {
            // Compare the provided password with the password stored in the database
            if (password === foundUser.password) {
                // If the password is correct, delete the user document
                await VerifyUser.deleteOne({ username: submittedUsername });

                console.log(`User '${submittedUsername}' deleted from the verification database`);

                // Redirect to the dashboard
                res.redirect('/dashboard');
            } else {
                // If password is incorrect
                res.status(401).send('Incorrect username or password!');
            }
        } else {
            // If user is not found
            res.status(404).send('User not found or incorrect details');
        }
    } catch (error) {
        console.error('Error during verification:', error.message);
        res.status(500).send('Internal Server Error');
    }

    console.log('Submitted username:', submittedUsername);
});


// Route for dashboard
app.get('/dashboard', (req, res) =>{
    res.render('lucky');
});

// Utility function to hash password before saving it to the database

// Insert sample user data to verification database with hashed passwords

// Start the server and initialize sample data
app.listen(process.env.PORT, function () {
  console.log(`Server is running on port ${process.env.PORT}`);
});
=======
const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User'); // The main database user model
const app = express();

// Set the default view engine to EJS
app.set('view engine', 'ejs');

// Connect to main MongoDB for user data
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to main MongoDB'))
    .catch((err) => console.error('Failed to connect to main MongoDB', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route for initial access
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', (req, res) => {
    console.log(req.body); // Log to see the data received

    const { name, DOB, aadhar_number, admission_number } = req.body;

    if (!name || !DOB || !aadhar_number || !admission_number) {
        return res.status(400).render('index', { message: 'All fields are required', error: true });
    }

    // Save user data to main database
    User.create({
        name: name,
        DOB: DOB,
        aadhar_number: aadhar_number,
        admission_number: admission_number,
    })
    .then(() => {
        console.log('User data saved successfully');
        res.status(200).redirect('/verify');
    })
    .catch((err) => {
        console.error('Error saving user data:', err);
        res.status(500).render('index', { message: 'An error occurred while saving data', error: true });
    });
});

// Route for verification
app.get('/verify', (req, res) => {
    res.render('verify');
});

// Connect to verification MongoDB
const verificationConnection = mongoose.createConnection(process.env.VERIFICATION_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
verificationConnection.once('open', () => console.log('Connected to verification MongoDB'));

// Model for VerifiedUser using separate connection
const VerifiedUserSchema = new mongoose.Schema({
    registration_number: String,
    DOB: String, // This acts as the password
});
const VerifiedUser = verificationConnection.model('VerifiedUser', VerifiedUserSchema);

app.post('/verify', async (req, res) => {
    const { registration_number, student_password } = req.body;
    try {
        console.log('Received registration_number:', registration_number);

        // Find the user by registration_number (used in the database)
        const user = await VerifiedUser.findOne({ registration_number: registration_number });
        console.log('Found user:', user);

        if (!user) {
            return res.status(401).render('verify', { message: 'Invalid registration number or password', error: true });
        }

        // Compare DOB with the student password (acting as a password here)
        if (user.DOB !== student_password) {
            return res.status(401).render('verify', { message: 'Invalid registration number or password', error: true });
        }

        // Successful verification
        res.render('verify', { message: 'Verification successful', error: false });
    } catch (error) {
        console.error('Error during verification:', error);
        res.status(500).render('verify', { message: 'Server error, please try again later', error: true });
    }
});

// Start the server
app.listen(process.env.PORT, function () {
    console.log(`Server is running on port ${process.env.PORT}`);
});
>>>>>>> 36f576dcaab08e56c21f73781b10a3a9e99ac19f
