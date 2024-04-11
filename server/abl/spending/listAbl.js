const spendingDao = require("../../dao/spending-dao.js");

async function ListAbl(req, res) {
  try {
    const spendingList = spendingDao.list();
    res.json(spendingList);
  } catch (e) {
    res.status(500).json({ spending: e.spending });
  }
}

module.exports = ListAbl;