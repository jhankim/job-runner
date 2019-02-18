const { param, body } = require('express-validator/check');
const bodyParser = require('body-parser');
const moment = require('moment');

const { Job, JobSchedule, JobHistory } = require('../store/db');
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
      id: jobId,
    },
    include: [JobHistory, JobSchedule],
    order: [[JobHistory, 'dateCreated', 'DESC']],
  })
    .then(job => {
      if (job) {
        res.send({ data: job });
      } else {
        res.status(404).json({
          message: `Couldn't find Job ID ${jobId}`,
        });
      }
    })
    .catch(err => {
      res.status(403).json({
        message: 'Something went wrong :(',
        data: err,
      });
    });
};

/**
 * Gets all jobs
 *
 * @param {object} req
 * @param {object} res
 */
const getJobs = (req, res) => {
  Job.findAll().then(jobs => {
    res.send({ data: jobs });
  });
};

/**
 * Creates a job
 *
 * @param {object} req
 * @param {object} res
 */
const createJob = (req, res) => {
  req
    .getValidationResult() // to get the result of above validate fn
    .then(validationHandler())
    .then(() => {
      // Define job object from req
      const job = {
        ...req.body,
        lastUpdateBy: req.body.createdBy,
        dateCreated: Date.now(),
        dateUpdated: Date.now(),
      };

      // Create a job config
      Job.create(job, {
        // Include the additional models
        include: [
          { model: JobSchedule, as: 'schedule' },
          // { model: store.JobTransport, as: 'transport' }
        ],
      })
        .then(job => {
          res.json({ data: job });
        })
        .catch(error => {
          res.status(403).json({ message: error });
        });
    })
    .catch(err => {
      // Send validation error messages back
      res.status(403).json({
        message: 'Validation error! See errors below.',
        errors: err,
      });
    });
};

/**
 * Runs a job
 *
 * @param {object} req
 * @param {object} res
 */
const runJob = (req, res) => {
  req
    .getValidationResult() // to get the result of above validate fn
    .then(validationHandler())
    .then(() => {
      const jobId = req.params.id;

      // Find the job to run
      Job.findOne({
        where: {
          id: jobId,
        },
      }).then(job => {
        // Check if job matching the provided jobId is found
        if (job) {
          // Schedule the job using the job data
          scheduleJob(job)
            .then(() => {
              // If job was successfully scheduled, send back message
              res.json({ message: `Running Job ID ${jobId}` });
            })
            .catch(error => {
              // If job was not scheduled, send back response with the error message
              res.status(403).send({ message: error });
            });
        } else {
          res.status(404).send({ message: `Job ID ${jobId} not found...` });
        }
      });
    })
    .catch(err => {
      // Send validation error messages back
      res.status(403).json({
        message: 'Validation error! See errors below.',
        errors: err,
      });
    });
};

/**
 * Validate request
 *
 * @param {integer} method
 */
const validate = method => {
  switch (method) {
    case 'createJob': {
      return [
        // Base job object validation
        body('name', 'Job name missing').exists({ checkFalsy: true }),
        body('description').optional(),
        body('customerId', 'Job customerId missing').exists(),
        body('customerId', 'Job customerId must be integer').isInt(),
        body('createdBy', 'Job createdBy missing').exists(),
        body('createdBy', 'Invalid email').isEmail(),
        body('alertEmails').optional(),

        // schedule object properties validation
        body('schedule', 'Missing object. `schedule` is missing.').exists(),
        body('schedule.enabled', '`schedule.enabled` is missing.').exists(),
        body('schedule.startAt', '`schedule.startAt` is missing.').exists(),
        body('schedule.interval', '`schedule.interval` is missing.').exists(),
        body('schedule.unit', '`schedule.unit` is missing.').exists(),

        // schedule object properties type validation
        body('schedule.enabled', '`schedule.enabled` must be boolean').isBoolean(),
        body('schedule.startAt', '`schedule.startAt` must be valid date string').custom(value => moment(value).isValid()),
        body('schedule.interval', '`schedule.interval` must be integer').isInt(),
        body('schedule.unit', '`schedule.unit` must be `minutes` or `hours`').isIn('minutes', 'hours'),
      ];
    }
    case 'runJob': {
      return [param('id', 'Job id not provided').exists(), param('id', 'Job ID must be integer').isInt()];
    }
  }
};

/**
 * Validation handler
 *
 * @param {callback} next
 */
const validationHandler = next => result => {
  // Return if there are no validation errors
  if (result.isEmpty()) return;
  if (!next) {
    return Promise.reject(result.array().map(item => item.msg));
  } else {
    return next(result.array().map(item => item.msg));
  }
};

module.exports = {
  createJob,
  runJob,
  getJob,
  getJobs,
  validate,
};
