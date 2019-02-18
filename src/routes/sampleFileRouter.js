const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: './uploads' });
const sampleDataController = require('../controllers/sampleDataController');

router.post('/getSampleData', upload.single('file'), sampleDataController.getSampleData);

module.exports = router;
