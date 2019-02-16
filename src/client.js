const kue = require('kue');

let queue = kue.createQueue();

// Event handler, called when job is saved to redis
queue.on('job enqueue', () => {
  console.log('job submitted to the queue.');
  process.exit(0);
})

let job = queue.create('download', {
  file: 'sample/path/to/file', // config for `download` job type
}).save();
