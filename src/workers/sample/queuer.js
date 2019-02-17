let kue = require('kue');
let queue = kue.createQueue();
let moment = require('moment');

const dummyJobs = [
  {
    id: 1,
    name: 'test conversion',
    schedule: {
      enabled: true,
      startAt: '2019-02-01 00:00:00',
      interval: 1,
      unit: 'minutes',
    },
    input: {
      location: {
        type: 'PUBLIC_URL',
        path: 'https://sample.csv'
      },
      location: {
        type: 'OLAPIC_FTP',
        path: '/asdasd',
        host: 123,
        user: 123,
        pw: 123,
      },
      type: 'CSV'
    },
    mapping: {
      productId: 'id',
      productName: 'name',
      productUrl: 'url',
      productImageUrl: 'image_url',
    },
    history: [
      {
        executionId: 1,
        status: 'SUCCESS'
      },
      {
        executionId: 2,
        status: 'SUCCESS'
      },
      {
        executionId: 3,
        status: 'SUCCESS'
      }
    ]
  }
];

queue.on('job enqueue', function (id, type) {
  console.log('Job %s got queued of type %s', id, type);
  process.exit();
})

// queuer.js - run as background process - run every X seconds
const scheduleJobs = (jobs) => {
  console.log('Looking for jobs to schedule');
  // loop through all jobs
  jobs.forEach(job => {
    // calculate execution time
    const { startAt, interval, unit } = job.schedule;
    const now = moment();
    const jobExecutionTime = moment(startAt).add(interval, unit);

    // is current time past execution time?
    if (now > jobExecutionTime && !isJobCurrentlyRunning(job.id)) {
      console.log(`Queuing up Job ID: ${job.id}, name: ${job.name}`);

      // queue up the job into the queue list
      return newJob = queue.create('convertFeed', {
        config: { id: job.id }, // file location & mapping config
      })
        .attempts(3) // if fail, retry 3 times
        .backoff({ delay: 60 * 1000 }) // wait 60s before retry
        .save();
    }
  })
}

const isJobCurrentlyRunning = (jobId) => {
  const job = dummyJobs.find(job => job.id = jobId); // get job using id
  const jobHistory = job.history; // history of job
  const runningJobs = jobHistory.filter((job) => job.status == 'RUNNING'); // array of running jobs

  return runningJobs.length;
}

scheduleJobs(dummyJobs);