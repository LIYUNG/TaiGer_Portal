const mongoose = require('mongoose');

const VC = require('../../models/VersionControl');
const logger = require('../../services/logger');

const detectChanges = (a, b) => {
  const original = {};
  const changes = {};
  for (const key in { ...a, ...b }) {
    if (['_id', 'updatedAt', 'whoupdated'].includes(key)) {
      continue;
    }
    if (a[key] !== b[key]) {
      original[key] = a[key];
      changes[key] = b[key];
    }
  }
  return { changeFrom: original, chnageTo: changes, changedBy: b?.whoupdated };
};

const enableVersionControl = (schema) => {
  schema.pre(
    ['findOneAndUpdate', 'updateOne', 'updateMany', 'update'],
    async function () {
      const collectionName = this.model.modelName;
      try {
        const condition = this.getQuery();
        this._oldVersion = await this.model.find(condition).lean();
      } catch (error) {
        logger.error(`VC (${collectionName}) - Error on pre hook: ${error}`);
      }
    }
  );

  schema.post(
    ['findOneAndUpdate', 'updateOne', 'updateMany', 'update'],
    async function () {
      const collectionName = this.model.modelName;
      try {
        const docs = this._oldVersion;
        delete this._oldVersion;
        const changes = this.getUpdate().$set;

        for (let doc of docs) {
          const updatedDoc = { ...doc, ...changes };
          const objectId = updatedDoc._id;
          const docChanges = detectChanges(doc, updatedDoc);

          await VC.findOneAndUpdate(
            {
              itemId: objectId,
              collectionName: collectionName
            },
            { $push: { changes: docChanges } },
            { upsert: true, new: true }
          );

          try {
            logger.info(
              `VC (${collectionName}) - Post hook executed successfully. (Id=${objectId})`
            );
          } catch (error) {
            logger.error(
              `VC (${collectionName}) - Error on post hook (Id=${objectId}): ${error}`
            );
          }
        }
      } catch (error) {
        logger.error(`VC (${collectionName}) - Error on post hook: ${error}`);
      }
    }
  );
};

module.exports = { enableVersionControl };
