const Ajv = require("ajv");
const ajv = new Ajv();
const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const incomeDao = require("../../dao/income-dao.js");
//const budgetPlanDao = require("../../dao/budgetPlan-dao.js");

const schema = {
  type: "object",
  properties: {
    date: { type: "string", format: "date-time" },
    value: {type: "string"},
    message: { type: "string" },
  },
  required: ["date", "value"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let income = req.body;

    // validate input
    const valid = ajv.validate(schema, income);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    income = incomeDao.create(income);
    res.json(income);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;