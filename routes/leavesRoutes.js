const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const bodyParser = require('body-parser');
const router = express.Router();
const leavesController = require('../controllers/leavesController');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// ----------------------------------------------------------------------------------------------------------------------------------
// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/') // save uploaded files in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // generate a unique filename
    }
});

const upload = multer({ storage: storage });

// Multer configuration
// ----------------------------------------------------------------------------------------------------------------------------------

// Route for adding new pothole
router.post('/add', upload.single('photo'), leavesController.addNewLeaf);   // tested

// Route for getting all potholes by user
router.get('/user/:username', leavesController.getLeavesByUser);   // tested

// Route for getting all potholes images by user
router.get('/images/:username', leavesController.getAllLeavesImgPath);   // tested

// Route for getting all potholes IDs by user
router.get('/ids/:username', leavesController.getAllLeavesIDByUser);   // tested

// Route for getting pothole image by ID
router.get('/image/:leafId', leavesController.getLeafImageById);   // tested

// Route for getting details of a pothole by ID
router.get('/details/:leafId', leavesController.getLeafDetailsById);   // tested

module.exports = router;