module.exports = function (sequelize, DataTypes) {
  return sequelize.define('schedule', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    jobId: { type: DataTypes.INTEGER, field: 'job_id' },
    enabled: DataTypes.BOOLEAN,
    startAt: { type: DataTypes.DATE, field: 'start_at' },
    interval: DataTypes.INTEGER,
    unit: DataTypes.ENUM('MINUTES', 'HOURS')
  }, {
      timestamps: false,
      tableName: 'job_schedule',
    });
};