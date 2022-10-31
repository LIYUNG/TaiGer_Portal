const DocumentStatus = {
  Uploaded: "uploaded",
  Missing: "missing",
  Accepted: "accepted",
  Rejected: "rejected",
  NotNeeded: "notneeded",
};

const CheckListStatus = {
  NotStarted: "notstarted",
  Processing: "processing",
  Finished: "finished",
  NotNeeded: "notneeded",
};

const TaskStatus = {
  Finished: "finished",
  Locked: "locked",
  Open: "Open",
  Pending: "pending",
  NotNeeded: "notneeded",
};
const RLs_CONSTANT = ['RL_A', 'RL_B', 'RL_C'];

module.exports = {
  DocumentStatus,
  CheckListStatus,
  TaskStatus,
  RLs_CONSTANT
};
