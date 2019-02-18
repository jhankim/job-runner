module.exports = function (sequelize, DataTypes) {
  return sequelize.define('history', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    jobId: { type: DataTypes.INTEGER, field: 'job_id' },
    queueId: { type: DataTypes.INTEGER, field: 'queue_id' },
    dateCreated: { type: DataTypes.DATE, field: 'date_created' },
    dateUpdated: { type: DataTypes.DATE, field: 'date_updated' },
    status: DataTypes.ENUM('SUCCESS', 'ERROR', 'RUNNING'),
    message: DataTypes.TEXT('long'),
  }, {
      timestamps: false,
      tableName: 'job_history',
    });
};