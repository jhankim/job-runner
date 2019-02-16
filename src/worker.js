let kue = require('kue');
let queue = kue.createQueue();
let sleep = require('sleep');

queue.process('convertFeed', (job, done) => {
  console.log(`Working on job ${job.id}`);
  convertFeed(job, done);
});

const convertFeed = (job, done) => {
  console.log(`Converting job: ${job.id}`);
  sleep.sleep(Math.ceil(Math.random() * 10));
  console.log('Job complete.');
  done();
};
