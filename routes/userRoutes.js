const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route for user creation
router.post('/create', userController.createUser);                      // tested

// Route for user login
router.post('/login', userController.loginUser);                        // tested

// Route for verifying user token
// Protected route
router.post('/protected', userController.verifyToken, (req, res) => {   // tested
    res.send(req.username);
});

// Route for user delete 
router.delete('/:username', userController.deleteUser);                 // tested
                 

module.exports = router;
