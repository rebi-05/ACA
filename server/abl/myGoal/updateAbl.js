const Ajv = require("ajv");
const ajv = new Ajv();

const myGoalDao = require("../../dao/myGoal-dao.js");

const schema = {
 type: "object",
 properties: { 
    id: { type: "string" },
    name: { type: "string" },
    value: {type: "string"},
    message: { type: "string" },
},
required: ["id", "name", "value"],
additionalProperties: false,
};


async function UpdateAbl(req, res) {
  try {
    let myGoal = req.body;

    // validate input
    const valid = ajv.validate(schema, myGoal);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const updatedmyGoal = myGoalDao.update(myGoal);

    if (!updatedmyGoal) {
      res.status(404).json({
        code: "myGoalNotFound",
        message: `myGoal ${myGoal.id} not found`,
      });
      return;
    }

    res.json(updatedmyGoal);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;