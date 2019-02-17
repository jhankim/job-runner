const mysqlHost = process.env.MYSQL_HOST || '127.0.0.1';

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: mysqlHost,
    dialect: 'mysql',
    port: 3306,
  });

const Job = sequelize.import('../models/job');
const Run = sequelize.import('../models/run');
const Schedule = sequelize.import('../models/schedule');
const Transport = sequelize.import('../models/transport');

const options = {
  foreignkey: 'job_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  hooks: true,
};

Job.hasMany(Run, options);
Run.belongsTo(Job, { foreignkey: 'job_id' });

Job.hasOne(Schedule, options);
Schedule.belongsTo(Job, { foreignkey: 'job_id' });

Job.hasOne(Transport, options);
Transport.belongsTo(Job, { foreignkey: 'job_id' });

Job.addScope('generic', {
  include: [{
    model: Schedule,
    attributes: ['enabled', 'frequency', 'next_run'],
    required: false,
  }, {
    model: Run,
    separate: true,
    limit: 1,
    order: [['id', 'DESC']],
    required: 'false',
  }, {
    model: Transport,
    attributes: ['type'],
  }],
});

Job.addScope('detail', {
  attributes: ['id', 'name', 'mapping', 'status'],
  include: [{
    model: Schedule,
    attributes: ['enabled', 'start_date', 'frequency'],
    required: false,
  }, {
    model: Run,
    separate: true,
    limit: 1,
    order: [['id', 'DESC']],
    required: 'false',
  }, {
    model: Transport,
    attributes: ['input', 'output', 'type'],
  }],
});

Job.addScope('withTransport', {
  attributes: ['id', 'name', 'mapping', 'status'],
  include: [{
    model: Schedule,
    attributes: ['user_id'],
    required: false,
  }, {
    model: Transport,
    attributes: ['input', 'output', 'type', 'password'],
  }],
});

Job.addScope('status', {
  attributes: ['id', 'status'],
  include: [{
    model: Schedule,
    attributes: ['enabled', 'next_run'],
    required: false,
  }, {
    model: Run,
    separate: true,
    limit: 1,
    order: [['id', 'DESC']],
    required: 'false',
  }],
});

Job.addScope('withinAnHour', function (endDate) {
  return {
    include: [{
      model: Schedule,
      where: {
        nextRun: {
          $lte: endDate,
        },
        enabled: true,
      },
    }],
  };
});

const setRunAsComplete = (run) => () => {
  return sequelize.transaction(function (t) {
    return run.update({
      status: 'DONE',
    }, { transaction: t }).then(function () {
      return Schedule.findOne({
        where: {
          job_id: run.jobId,
        },
      }, { transaction: t }).then(function (schedule) {
        let nextRun = util.jsTimeFromMysql(schedule.nextRun);
        if (nextRun <= new Date()) {
          nextRun.setHours(nextRun.getHours() + schedule.frequency);
          nextRun.setMinutes(0);
          nextRun.setSeconds(0);
        }
        schedule.nextRun = util.mysqlTime(nextRun);
        return schedule.save({ transaction: t });
      });
    });
  });
};

const updateJob = (jobId, customerId, job, updatePassword) => {
  return Job.update(job, {
    where: {
      customerId,
      id: jobId,
    },
  }).then(() => {
    return Schedule.update(job.schedule, {
      where: {
        job_id: jobId,
      },
    }).then(() => {
      let fields = ['type', 'input', 'output'];
      if (updatePassword) fields.push('password');
      return Transport.update(job.transport, {
        fields,
        where: {
          job_id: jobId,
        },
      });
    });
  });
};

const pauseJob = (jobId, customerId) => {
  return Job.scope('detail').findOne({
    where: {
      id: jobId,
      customerId,
    },
  }).then(function (job) {
    return job.getSchedule().then((schedule) => {
      schedule.enabled = false;
      return schedule.save();
    });
  });
};

const resumeJob = (jobId, customerId) => {
  return Job.scope('detail').findOne({
    where: {
      id: jobId,
      customerId,
    },
  }).then(function (job) {
    return job.getSchedule().then((schedule) => {
      let nextRun = new Date();
      nextRun.setHours(nextRun.getHours() + parseInt(schedule.frequency));
      schedule.nextRun = util.mysqlTime(nextRun),
        schedule.enabled = true;
      return schedule.save();
    });
  });
};

const setRunAsError = (run) => {
  return run.update({
    status: 'ERROR',
  });
};

module.exports = {
  Job,
  Run,
  Schedule,
  Transport,
  setRunAsComplete,
  setRunAsError,
  pauseJob,
  resumeJob,
  updateJob,
};