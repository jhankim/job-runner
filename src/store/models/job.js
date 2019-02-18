module.exports = function (sequelize, DataTypes) {
  return sequelize.define('job', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    customerId: { type: DataTypes.INTEGER, field: 'customer_id' },
    dateCreated: { type: DataTypes.DATE, field: 'date_created' },
    dateUpdated: { type: DataTypes.DATE, field: 'date_updated' },
    createdBy: { type: DataTypes.STRING, field: 'created_by' },
    lastUpdateBy: { type: DataTypes.STRING, field: 'last_update_by' },
    alertEmails: { type: DataTypes.TEXT, field: 'alert_emails' },
  }, {
      timestamps: false,
      tableName: 'job',
    });
};

