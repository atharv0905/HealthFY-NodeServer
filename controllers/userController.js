const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../config');
const User = require('../models/userSchema');
const UserLogin = require('../models/userLoginSchema');

// ----------------------------------------------------------------------------------------------------------------------------------
// create User
async function createUser(req, res) {
    const { username, password } = req.body;
    try {
        // Check if the User already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(301).json({ message: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds

        // Create a new User instance with hashed password
        const newUser = new User({ username, password: hashedPassword });

        // Save the new User to the database
        await newUser.save();

        res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating User:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while creating User' });
    }
}
// create User
// ----------------------------------------------------------------------------------------------------------------------------------


// ----------------------------------------------------------------------------------------------------------------------------------
// User login
async function loginUser(req, res) {
    const { username, password } = req.body;
    try {
        // Find the User with the provided username
        const user = await User.findOne({ username });

        // If no User found with the provided username
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Compare the provided password with the hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '672h' });
            const newUserLogin = new UserLogin({ username });
            await newUserLogin.save();
            // return res.status(200).json({ token });
            return res.status(200).send(token);
        } else {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

    } catch (error) {
        console.error('Error during User login:', error);
        return res.status(500).json({ message: 'An error occurred' });
    }
}
// User login
// ----------------------------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------------------------
// Verify User
// Middleware to verify JWT token
function verifyToken(req, res, next) {
    let token = req.body.token;

    // Check if token is found
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    // Verify token
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        req.username = decoded.username;
        const newUserLogin = new UserLogin({ username: req.username });
        newUserLogin.save();
        next();
    });
}
// Verify User
// ----------------------------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------------------------
// Delete User
async function deleteUser(req, res) {
    const { username } = req.params;
    try {
        // Find the User with the provided username and delete it
        const deletedUser = await User.findOneAndDelete({ username });

        // If no User found with the provided username
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({ success: true, message: 'User deleted successfully', deletedUser });
    } catch (error) {
        console.error('Error deleting User:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while deleting User' });
    }
}
// Delete User
// ----------------------------------------------------------------------------------------------------------------------------------

module.exports = {
    loginUser,
    createUser,
    verifyToken,
    deleteUser
};
