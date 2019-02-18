const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobsController');

router.get('/jobs', jobsController.getJobs);
router.get('/jobs/:id', jobsController.getJob);
router.post(
  '/jobs/create',
  jobsController.validate('createJob'),
  jobsController.createJob
);
router.post(
  '/jobs/:id/run',
  jobsController.validate('runJob'),
  jobsController.runJob
);

module.exports = router;
