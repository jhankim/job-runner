module.exports = function (sequelize, DataTypes) {
  return sequelize.define('schedule', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    jobId: { type: DataTypes.INTEGER, field: 'job_id' },
    createdDate: { type: DataTypes.DATE, field: 'created_date' },
    status: DataTypes.ENUM('SUCCESS', 'ERROR', 'RUNNING'),
    message: DataTypes.TEXT('long'),
  }, {
      timestamps: false,
      tableName: 'job_history',
    });
};