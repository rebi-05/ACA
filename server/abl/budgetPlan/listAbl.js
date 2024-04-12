const budgetPlanDao = require("../../dao/budgetPlan-dao.js");

async function ListAbl(req, res) {
  try {
    const budgetPlanList = budgetPlanDao.list();
    res.json(budgetPlanList);
  } catch (e) {
    res.status(500).json({ budgetPlan: e.budgetPlan });
  }
}

module.exports = ListAbl;