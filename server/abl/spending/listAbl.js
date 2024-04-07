const spendingDao = require("../../dao/spending-dao.js");

async function ListAbl(req, res) {
  try {
    const spendingList = spendingDao.list();

    spendingList.forEach((spending) => {
      spending.userMap = attendanceMap[spending.id] || {};
    });

    res.json(spendingList);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListAbl;