let kue = require('kue');
let queue = kue.createQueue();
let express = require('express');
let ui = require('kue-ui-express');
let app = express();

// Configure & mount Kue UI
ui(app, '/kue/', '/api/')

// Mount Kue JSON API
app.use('/api', kue.app);

// Listen on port 5000
app.listen(5000, () => {
  console.log('Kue UI is now running on http://localhost:5000');
});
