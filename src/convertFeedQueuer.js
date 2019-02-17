let kue = require('kue');
let queue = kue.createQueue();
let moment = require('moment');

const dummyJobs = [{
  id: 1,
  input: {
    type: 'CSV',
    location: {
      type: 'URL',
      path: '/Users/jaehankim/OLAPIC/PFC/test-sales-records-500k.csv'
    },
  },
  mapping: {
    orderId: 'Order ID',
    itemType: 'Item Type'
  },
}];

queue.on('job enqueue', function (id, type) {
  console.log('Job %s got queued of type %s', id, type);
  process.exit();
})

// queuer.js - run as background process - run every X seconds
const scheduleJobs = (jobs) => {
  console.log('Looking for jobs to schedule');
  // loop through all jobs
  jobs.forEach(job => {
    console.log(`Queuing up Job ID: ${job.id}`);

    // queue up the job into the queue list
    return newJob = queue.create('convertFeed', {
      ...job
    })
      .attempts(3) // if fail, retry 3 times
      .backoff({ delay: 60 * 1000 }) // wait 60s before retry
      .save();
  })
}

const isJobCurrentlyRunning = (jobId) => {
  const job = dummyJobs.find(job => job.id = jobId); // get job using id
  const isJobRunning = job.status == 'RUNNING' ? true : false;

  return isJobRunning;
}

scheduleJobs(dummyJobs);