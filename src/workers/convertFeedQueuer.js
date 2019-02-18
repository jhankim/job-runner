require('dotenv').config();

const kue = require('kue');
const queue = kue.createQueue();
const moment = require('moment');
const { Job, JobSchedule, JobHistory } = require('../store/db');

/**
 * Run the scheduler, should be run as a separate work process
 */
const runScheduleJobs = () => {
  // Get all jobs and execute.
  const jobs = Job.findAll({ include: [JobSchedule] });
  jobs.then((jobs) => scheduleJobs(jobs));

  // Run every 5 seconds
  setInterval(() => {
    // Execute scheduleJobs
    jobs.then((jobs) => scheduleJobs(jobs));
  }, 5000);
}

/**
 * Schedules jobs
 * 
 * @param {array} jobs 
 */
const scheduleJobs = (jobs) => {
  console.log(`${moment()} - Looking for jobs to schedule`);

  // Loop through all jobs
  jobs.forEach(async job => {
    const jobData = { ...job.dataValues };
    const jobScheduleData = { ...jobData.schedule.dataValues }

    const { enabled, startAt, interval, unit } = jobScheduleData; // Get schedule info
    const now = moment(); // Current time
    const jobExecutionTime = moment(startAt).add(interval, unit); // Calculate job exec time
    const lastJobRun = await findLastJobRun(jobData.id); // Get last job run
    const shouldRun = lastJobRun && moment(lastJobRun.dataValues.dateCreated) < moment().subtract(interval, unit);

    // Make sure current time is greater than job execution time and job isn't running
    if (enabled && now > jobExecutionTime && shouldRun && await isJobCurrentlyRunning(jobData.id) === false) {
      console.log(`${moment()} - Job ID ${jobData.id} needs to run. Queuing it up!`);

      // Queue up the job into the queue list
      return queueJob(jobData);
    }
  });
}

/**
 * Schedules a job
 * @param {object} job
 */
const scheduleJob = async (job) => {
  const jobData = job.dataValues

  if (await isJobCurrentlyRunning(jobData.id) === false) {
    return queueJob(jobData);
  } else {
    return Promise.reject(`Job ID ${jobData.id} is already running. Try again later.`);
  }
}

/** Queue a job */
const queueJob = (jobData) => {
  const now = moment();
  // Queue up the job into the queue list
  return newJob = queue.create('convertFeed', {
    ...jobData
  })
    .attempts(3) // If fail, retry 3 times
    .backoff({ delay: 60 * 1000 }) // Wait 60s before retry
    // .ttl(60 * 5000) // TTL set as 10 minutes
    .ttl(10000)
    .save((err) => {
      if (err) {
        // Create a new job history with ERROR status and detailed message
        JobHistory.create({
          jobId: jobData.id,
          queueId: newJob.id,
          dateCreated: now,
          dateUpdated: now,
          status: 'ERROR',
          message: err
        })
      } else {
        // Create a new job history with RUNNING status
        JobHistory.create({
          jobId: jobData.id,
          queueId: newJob.id,
          dateCreated: now,
          dateUpdated: now,
          status: 'RUNNING',
        })
      }
    })
}

/**
 * Return the last job run (history)
 * @param {number} jobId 
 */
const findLastJobRun = async (jobId) => {
  return JobHistory.findOne({
    where: { jobId },
    order: [['dateCreated', 'DESC']]
  })
    .then((lastJobRun) => {
      return lastJobRun;
    });
}

/**
 * Checks if there's a running job
 * @param {number} jobId 
 */
const isJobCurrentlyRunning = async (jobId) => {
  return JobHistory.findAll({ where: { jobId } }).then((history) => {
    const runningJobs = history.filter((item) => item.status === 'RUNNING');
    const isJobRunning = runningJobs.length ? true : false;

    return isJobRunning;
  });
}

module.exports = {
  scheduleJob,
  runScheduleJobs
}
