const Leaves = require('../models/leafSchema');
const path = require('path');
const fs = require('fs').promises;

const addNewLeaf = async (req, res) => {
    const { latitude, longitude, status, username, region } = req.body;
    const newLeaf = new Leaves({
        latitude: latitude,
        longitude: longitude,
        status: status,
        imagePath: req.file.path,
        username: username,
        region: region
    });
    try {
        const savedLeaf = await newLeaf.save();
        res.status(201).json({ message: "succes", leaf: savedLeaf });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


const getLeavesByUser = async (req, res) => {
    const { username } = req.params;
    try {
        const leaves = await Leaves.find({ username: username });
        res.status(200).json(leaves);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


const getAllLeavesImgPath = async (req, res) => {
    try {
        const username = req.params.username; // Assuming username is passed as a URL parameter
        const leaves = await Leaves.find({ username: username }).select('imagePath');
        const imagePaths = leaves.map(leaf => leaf.imagePath);
        res.json(imagePaths);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


const getAllLeavesIDByUser = async (req, res) => {
    try {
        const username = req.params.username; // Assuming username is passed as a URL parameter
        const leaves = await Leaves.find({ username: username }).select('_id');
        const leafIDs = leaves.map(leaf => leaf._id);
        res.json(leafIDs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

const getLeafImageById = async (req, res) => {
    try {
        const leafId = req.params.leafId; // Assuming leafId is passed as a URL parameter
        const leaf = await Leaves.findById(leafId).select('imagePath');

        if (!leaf) {
            return res.status(404).json({ message: 'Leaf not found' });
        }

        const imagePath = path.join(process.cwd(), leaf.imagePath); // Constructing path based on the current working directory
        const image = await fs.readFile(imagePath);

        // Set the appropriate content type header
        res.set('Content-Type', 'image/jpeg'); // Assuming images are JPEG format

        // Send the image data as a buffer
        res.status(200).send(image);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getLeafDetailsById = async (req, res) => {
    try {
        const leafId = req.params.leafId; // Assuming leafId is passed as a URL parameter
        const leaf = await Leaves.findById(leafId);

        if (!leaf) {
            return res.status(404).json({ message: 'Leaf not found' });
        }

        const { status, latitude, longitude, region, detectedAt } = leaf;
        // Convert detectedAt to GMT string
        const detectedAtGMT = new Date(detectedAt).toGMTString();
        res.json({ status, latitude, longitude, region, detectedAt: detectedAtGMT });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = {
    addNewLeaf,
    getLeavesByUser,
    getAllLeavesImgPath,
    getAllLeavesIDByUser,
    getLeafImageById,
    getLeafDetailsById
};