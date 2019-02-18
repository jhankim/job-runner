const { Job, JobSchedule, JobHistory } = require('../store/db');
const bodyParser = require('body-parser');
const { scheduleJob } = require('../workers/convertFeedQueuer');

/**
 * Get a single job
 * 
 * @param {object} req 
 * @param {object} res 
 */
const getJob = (req, res) => {
  const jobId = req.params.id;

  // Find the job using job Id
  Job.findOne({
    where: {
      id: jobId
    },
    include: [
      JobHistory,
      JobSchedule
    ],
    order: [
      [
        JobHistory,
        'dateCreated',
        'DESC'
      ]
    ]
  })
    .then((job) => {
      if (job) {
        res.send({ data: job })
      } else {
        res.status(404).json({
          message: `Couldn't find Job ID ${jobId}`
        });
      }
    })
    .catch(err => {
      res.status(403).json({
        message: 'Something went wrong :(',
        data: err
      });
    })
}

/**
 * Gets all jobs
 * 
 * @param {object} req 
 * @param {object} res 
 */
const getJobs = (req, res) => {
  Job.findAll().then((jobs) => {
    res.send({ data: jobs })
  })
}

/**
 * Creates a job
 * 
 * @param {object} req 
 * @param {object} res 
 */
const createJob = (req, res) => {

  // Define job object from req
  const job = {
    ...req.body,
    lastUpdateBy: req.body.createdBy,
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
    schedule: {
      enabled: true,
      startAt: Date.now(),
      interval: 5,
      unit: "hours"
    },
  };

  // Create a job config
  Job.create(job, {
    // Include the additional models
    include: [
      { model: JobSchedule, as: 'schedule' }
      // { model: store.JobTransport, as: 'transport' }
    ]
  })
    .then((job) => {
      res.json({ data: job });
    })
    .catch((error) => {
      res.status(403).json({ message: error });
    });
  // const job = createJobObj(req.body, req.params.customerId, res.locals.userId);

  // data.Job.create(job, {
  //   include: [data.Schedule, data.Transport],
  // }).then((job) => {
  //   res.json({ success: true, job });
  //   if (!job) return Promise.reject({ stack: 'No Job Exists with that ID' });
  //   if (req.body.output.run_on_save) {
  //     runJob(job.customerId, job.id, res.locals.userId, false);
  //   }
  // }).catch(errorConnection(res));
  // res.send({ code: 200, data: { message: 'Successfully created' } })
};

/**
 * Runs a job
 * 
 * @param {object} req 
 * @param {object} res 
 */
const runJob = (req, res) => {
  const jobId = req.params.id;

  // Find the job to run
  Job.findOne({
    where: {
      id: jobId
    }
  })
    .then(job => {
      // Check if job matching the provided jobId is found
      if (job) {
        // Schedule the job using the job data
        scheduleJob(job)
          .then(() => {
            // If job was successfully scheduled, send back message
            res.json({ message: `Running Job ID ${jobId}` });
          })
          .catch((error) => {
            // If job was not scheduled, send back response with the error message
            res.status(403).send({ message: error });
          });

      } else {
        res.status(404).send({ message: `Job ID ${jobId} not found...` });
      }
    });
}

module.exports = {
  createJob,
  runJob,
  getJob,
  getJobs
}