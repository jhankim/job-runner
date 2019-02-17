module.exports = function (sequelize, DataTypes) {
  return sequelize.define('transport', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    jobId: { type: DataTypes.INTEGER, field: 'job_id' },
    type: DataTypes.ENUM('OLAPIC_FTP', 'FTP', 'SFTP', 'HTTP'),
    path: DataTypes.STRING,
    ftpHost: { type: DataTypes.STRING, field: 'ftp_host' },
    ftpUser: { type: DataTypes.STRING, field: 'ftp_user' },
    ftpPw: { type: DataTypes.STRING, field: 'ftp_pw' },
  }, {
      timestamps: false,
      tableName: 'job_transport',
    }
  )
};
