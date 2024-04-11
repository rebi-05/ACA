const myGoalDao = require("../../dao/myGoal-dao.js");

async function ListAbl(req, res) {
  try {
    const myGoalList = myGoalDao.list();
    res.json(myGoalList);
  } catch (e) {
    res.status(500).json({ myGoal: e.myGoal });
  }
}

module.exports = ListAbl;