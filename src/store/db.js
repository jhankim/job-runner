const Sequelize = require('sequelize');

const mysqlHost = process.env.MYSQL_HOST || '127.0.0.1';
const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
  host: mysqlHost,
  dialect: 'mysql',
  port: 3306,
  timezone: process.env.TZ,
});

const Job = sequelize.import('./models/job');
const JobSchedule = sequelize.import('./models/job_schedule');
const JobHistory = sequelize.import('./models/job_history');
// const JobTransport = sequelize.import('./models/job_transport');

// Table relations
Job.hasOne(JobSchedule);
JobSchedule.belongsTo(Job, { foreignkey: 'job_id' });

Job.hasMany(JobHistory);
JobHistory.belongsTo(Job, { foreignkey: 'job_id' });

// Job.hasOne(JobTransport, options);
// JobTransport.belongsTo(Job, { foreignkey: 'job_id' });

module.exports = {
  Job,
  JobSchedule,
  JobHistory,
};
