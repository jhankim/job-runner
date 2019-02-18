require('dotenv').config();

const kue = require('kue');
const queue = kue.createQueue();
const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const kueUI = require('kue-ui-express');
const app = express();
const { runScheduleJobs } = require('./workers/convertFeedQueuer');

// Routes
const jobsRouter = require('./routes/jobsRouter');

// Use bodyParser and expressValidator
app.use(bodyParser.json()).use(expressValidator());

// Configure & mount Kue UI
kueUI(app, '/kue/', '/api/kue');

// Mount routes
app.use('/api/kue', kue.app).use('/api', jobsRouter);

// Listen on port 5000
app.listen(5000, () => {
  console.log('Kue UI is now running on http://localhost:5000');
});

runScheduleJobs();
