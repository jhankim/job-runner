require('dotenv').config();
let kue = require('kue');
let queue = kue.createQueue();
let express = require('express');
let ui = require('kue-ui-express');
let app = express();
let bodyParser = require('body-parser');

app.use(bodyParser.json());

let jobsController = require('./controllers/jobs');

// Configure & mount Kue UI
ui(app, '/kue/', '/api/')

// Mount Kue JSON API
app.use('/api', kue.app);

app.post('/jobs/create', jobsController.createJob);

// Listen on port 5000
app.listen(5000, () => {
  console.log('Kue UI is now running on http://localhost:5000');
});
