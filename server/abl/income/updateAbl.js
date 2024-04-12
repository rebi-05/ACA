const Ajv = require("ajv");
const ajv = new Ajv();
const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const incomeDao = require("../../dao/income-dao.js");
const budgetPlanDao = require("../../dao/budgetPlan-dao.js"); 

const schema = {
 type: "object",
 properties: { 
    id: { type: "string" },
    date: { type: "string", format: "date-time" },
    value: {type: "number"},
    message: { type: "string" },
},
required: ["id", "date", "value"],
additionalProperties: false,
};


async function UpdateAbl(req, res) {
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

    // Extract month and year from income date
    const month = new Date(income.date).getMonth() + 1;
    const year = new Date(income.date).getFullYear();

    // Check if budget plan exists for the specified month and year
    const budgetPlan = budgetPlanDao.getByYearAndMonth(year, month);
    if (!budgetPlan) {
      return res.status(400).json({
        code: "budgetPlanDoesNotExist",
        message: "Budget plan for the specified month and year does not exist",
      });
    }

    const updatedIncome = incomeDao.update(income);

    if (!updatedIncome) {
      res.status(404).json({
        code: "incomeNotFound",
        message: `Income ${income.id} not found`,
      });
      return;
    }

    res.json(updatedIncome);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;