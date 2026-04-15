const disputes = [];
let currentDisputeId = 1;

const createDisputeRecord = (record) => {
  const dispute = {
    id: currentDisputeId++,
    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...record,
  };

  disputes.push(dispute);
  return dispute;
};

const listDisputes = (filterFn = () => true) => disputes.filter(filterFn);

const findDisputeById = (id) => disputes.find((item) => item.id === Number(id));

const updateDisputeRecord = (id, updates) => {
  const dispute = findDisputeById(id);
  if (!dispute) {
    return null;
  }

  Object.assign(dispute, updates, { updatedAt: new Date().toISOString() });
  return dispute;
};

module.exports = {
  createDisputeRecord,
  listDisputes,
  findDisputeById,
  updateDisputeRecord,
};
