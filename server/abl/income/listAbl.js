const incomeDao = require("../../dao/income-dao.js");

async function ListAbl(req, res) {
  try {
    const incomeList = incomeDao.list();

    incomeList.forEach((income) => {
      income.userMap = attendanceMap[income.id] || {};
    });

    res.json(incomeList);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListAbl;