module.exports = function (sequelize, DataTypes) {
  return sequelize.define('transport', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    type: DataTypes.ENUM('OLAPIC_FTP', 'FTP', 'SFTP', 'HTTP'),
    input: DataTypes.TEXT('long'),
    output: DataTypes.TEXT('long'),
    jobId: { type: DataTypes.INTEGER, field: 'job_id' },
    password: DataTypes.STRING,
  }, {
      timestamps: false,
      tableName: 'job_transport',
    });
