const store = require('../store/db');
const bodyParser = require('body-parser');

const createJob = (req, res) => {

  // Define job object from req
  const job = {
    schedule: {
      enabled: true,
      startAt: Date.now(),
      interval: 5,
      unit: "hours"
    },
    ...req.body
  };

  // Create a job config
  store.Job.create(job, {
    // Include the additional models
    include: [
      { model: store.JobSchedule, as: 'schedule' },
      { model: store.JobTransport, as: 'transport' }
    ]
  })
    .then((job) => {
      res.json({ success: true, job });
    })
    .catch((error) => {
      console.log(error);
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

module.exports = {
  createJob
}