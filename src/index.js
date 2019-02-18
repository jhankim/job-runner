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
const sampleFileRouter = require('./routes/sampleDataRouter');

// Use bodyParser and expressValidator
app.use(bodyParser.json());
app.use(expressValidator());

// Configure & mount Kue UI
kueUI(app, '/kue/', '/api/kue');

// Mount routes
app.use('/api/kue', kue.app);
app.use('/api', jobsRouter);
app.use('/api', sampleFileRouter);

// this is a trivial body error implementation
app.use((err, req, res, next) => {
  // body-parser will set this to 400 if the json is in error
  if (err.status === 400) return res.status(err.status).json({ message: 'Syntax error, please check your JSON!' });

  return next(err); // if it's not a 400, let the default error handling do it.
});

// Listen on port 5000
app.listen(5000, () => {
  console.log('Kue UI is now running on http://localhost:5000');
});

// runScheduleJobs();
