const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/authDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Set up EJS as the template engine
app.set('view engine', 'ejs');

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// User Schema and Model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    try {
        const newUser = new User({
            username: req.body.username,
            password: req.body.password // Storing plain text (for demonstration purposes)
        });
        await newUser.save();
        res.redirect('/');
    } catch (error) {
        res.render('error', { message: 'Registration failed. Try a different username.' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user && user.password === req.body.password) {
            res.render('dashboard', { username: user.username }); // Login successful
        } else {
            res.render('error', { message: 'Invalid username or password.' }); // Login failed
        }
    } catch (error) {
        res.render('error', { message: 'An error occurred during login.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
