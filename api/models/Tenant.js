const { model, Schema } = require('mongoose');

const tenantsSchema = new Schema({
  tenantId: { type: String, require: true, unique: true },
  domainName: { type: String, require: true, unique: true },
  updatedAt: Date
});

const Tenant = model('Tenant', tenantsSchema);
module.exports = { Tenant, tenantsSchema };
