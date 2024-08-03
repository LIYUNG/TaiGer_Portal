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
  return {
    originalValues: original,
    updatedValues: changes,
    changedBy: b?.whoupdated
  };
};

const handleProgramChanges = (
  schema,
  { StudentModel, DocumentthreadModel, surveyInputModel }
) => {
  schema.pre(
    ['findOneAndUpdate', 'updateOne', 'updateMany', 'update'],
    async function (doc) {
      try {
        const condition = this.getQuery();
        this._originals = await this.model.find(condition).lean();
      } catch (error) {
        logger.error(`ProgramHook - Error on pre hook: ${error}`);
      }
    }
  );

  schema.post(
    ['findOneAndUpdate', 'updateOne', 'updateMany', 'update'],
    async function (doc) {
      try {
        const docs = this._originals;
        delete this._originals;
        const changes = this.getUpdate().$set;
        if (!isCrucialChanges(changes) || docs?.length === 0) {
          return;
        }

        for (let doc of docs) {
          const updatedDoc = { ...doc, ...changes };
          const programId = updatedDoc._id;

          try {
            logger.info(
              `ProgramHook - Crucial changes detected on Program (Id=${programId}): ${JSON.stringify(
                changes
              )}`
            );
            await handleThreadDelta(updatedDoc, {
              StudentModel,
              DocumentthreadModel,
              surveyInputModel
            });
            logger.info(
              `ProgramHook - Post hook executed successfully. (Id=${programId})`
            );
          } catch (error) {
            logger.error(
              `ProgramHook - Error on post hook (Id=${programId}): ${error}`
            );
          }
        }
      } catch (error) {
        logger.error(`ProgramHook - Error on post hook: ${error}`);
      }
    }
  );
};

const enableVersionControl = (schema, { VCModel }) => {
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

      const docs = this._oldVersion;
      delete this._oldVersion;
      const changes = this.getUpdate().$set;

      for (let doc of docs) {
        const updatedDoc = { ...doc, ...changes };
        const objectId = updatedDoc._id;
        const docChanges = detectChanges(doc, updatedDoc);

        // don't save if no changes
        if (
          Object.keys(docChanges.originalValues).length === 0 &&
          Object.keys(docChanges.updatedValues).length === 0
        ) {
          continue;
        }

        try {
          await VCModel.findOneAndUpdate(
            {
              docId: objectId,
              collectionName: collectionName
            },
            { $push: { changes: docChanges } },
            { upsert: true, new: true }
          );
          logger.info(
            `VC (${collectionName}) - Post hook executed successfully. (Id=${objectId})`
          );
        } catch (error) {
          logger.error(
            `VC (${collectionName}) - Error on post hook (Id=${objectId}): ${error}`
          );
        }
      }
    }
  );
};

module.default = enableVersionControl;
module.exports = { handleProgramChanges, enableVersionControl };
