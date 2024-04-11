const budgetPlanDao = require("../../dao/budgetPlan-dao.js");

async function ListAbl(req, res) {
  try {
    const budgetPlanList = budgetPlanDao.list();

    budgetPlanList.forEach((budgetPlan) => {
      budgetPlan.userMap = attendanceMap[budgetPlan.id] || {};
    });

    res.json(budgetPlanList);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListAbl;