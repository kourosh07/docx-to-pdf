const express = require('express');
const path = require('path');
const app = express();
const multer = require('multer');
const docxtopdf = require('docx-pdf');

// Serve static files from the 'uploads' directory
app.use(express.static('uploads'));

const bodyParser = require('body-parser');

// Configure multer for file uploads
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({ storage: storage });

// Use bodyParser middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Handle POST request for converting DOCX to PDF
app.post("/docxtopdf", upload.single('file'), (req, res) => {
    console.log('file path', req.file.path);

    // Generate a unique output file path for the converted PDF
    let outputfilepath = Date.now() + "output.pdf";

    // Convert DOCX to PDF
    docxtopdf(req.file.path, outputfilepath, (err, result) => {
        if (err) {
            console.log('error', err);
        } else {
            // Download the converted PDF file
            res.download(outputfilepath, () => { });
        }
    });
});

// Start the server on port 5000
app.listen(5000, () => {
    console.log('App is listening on port 5000');
});
