let kue = require('kue');
let queue = kue.createQueue();

// Get all jobs using kue.Job
// kue.Job.range(0, -1, 'asc', (err, jobs) => {
//   jobs.map(job => {
//     console.log(`Job ID: ${job.id}\n\tJob Data: ${job.data}\n\tJob Status: ${job._state}`);
//   })
// })

// Get only completed jobs
queue.complete((err, jobs) => {
  jobs.map(jobId => {
    kue.Job.get(jobId, function (err, job) {
      console.log(`Job ID: ${job.id}\n\tdata: ${job.data}`);
    });
  })
})