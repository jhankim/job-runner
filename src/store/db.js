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

const Job = sequelize.import('./models/job');
const JobHistory = sequelize.import('./models/job_history');
const JobSchedule = sequelize.import('./models/job_schedule');
const JobTransport = sequelize.import('./models/job_transport');

const options = {
  foreignkey: 'job_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  hooks: true,
};

// Table relations
Job.hasMany(JobHistory, options);
JobHistory.belongsTo(Job, { foreignkey: 'job_id' });

Job.hasOne(JobSchedule, options);
JobSchedule.belongsTo(Job, { foreignkey: 'job_id' });

Job.hasOne(JobTransport, options);
JobTransport.belongsTo(Job, { foreignkey: 'job_id' });

Job.addScope('generic', {
  include: [
    {
      model: JobSchedule,
      required: false,
      attributes: ['enabled', 'start_at', 'interval', 'unit'],
    },
    {
      model: JobHistory,
      required: false,
      separate: true,
      order: [['created_date', 'DESC']],
    },
    {
      model: JobTransport,
      attributes: ['type'],
    }],
});

const createJob = (jobData) => {
  return Job.create(jobData)
}

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

const setRunAsError = (run) => {
  return run.update({
    status: 'ERROR',
  });
};

module.exports = {
  Job,
  JobHistory,
  JobSchedule,
  JobTransport,
  createJob,
};