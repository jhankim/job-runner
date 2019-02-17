module.exports = function (sequelize, DataTypes) {
  return sequelize.define('schedule', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    customerId: { type: DataTypes.INTEGER, field: 'customer_id' },
    dateCreated: { type: DataTypes.DATE, field: 'date_created' },
    dateUpdated: { type: DataTypes.DATE, field: 'date_updated' },
    createdBy: { type: DataTypes.DATE, field: 'created_by' },
    lastUpdateBy: { type: DataTypes.DATE, field: 'last_update_by' },
    alertEmails: { type: DataTypes.TEXT, field: 'alert_emails' },
  }, {
      timestamps: false,
      tableName: 'job',
    });
};

