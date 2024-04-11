const incomeDao = require("../../dao/income-dao.js");

async function ListAbl(req, res) {
  try {
    const incomeList = incomeDao.list();
    res.json(incomeList);
  } catch (e) {
    res.status(500).json({ income: e.income });
  }
}

module.exports = ListAbl;