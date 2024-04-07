const Ajv = require("ajv");
const ajv = new Ajv();

const myGoalDao = require("../../dao/myGoal-dao.js"); 

const schema = {
  type: "object",
  properties: {
    name: { type: "string"},
    value: {type: "string"},
    message: { type: "string" },
  },
  required: ["name", "value"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
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

    myGoal = myGoalDao.create(myGoal);
    res.json(myGoal);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;