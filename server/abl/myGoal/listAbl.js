const myGoalDao = require("../../dao/myGoal-dao.js");

async function ListAbl(req, res) {
  try {
    const myGoalList = myGoalDao.list();

    myGoalList.forEach((myGoal) => {
      myGoal.userMap = attendanceMap[myGoal.id] || {};
    });

    res.json(myGoalList);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListAbl;
