const Ajv = require("ajv");
const ajv = new Ajv();
const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const incomeDao = require("../../dao/income-dao.js");
const budgetPlanDao = require("../../dao/budgetPlan-dao.js");

const schema = {
  type: "object",
  properties: {
    date: { type: "string", format: "date-time" },
    value: {type: "number"},
  },
  required: ["date", "value"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let incomeData = req.body;

    // Validate input against schema
    const valid = ajv.validate(schema, incomeData);
    if (!valid) {
      return res.status(400).json({
        code: "invalidRequest",
        message: "Invalid request data",
        validationErrors: ajv.errors,
      });
    }

    // Extract month and year from income date
    const month = new Date(incomeData.date).getMonth() + 1;
    const year = new Date(incomeData.date).getFullYear();

    // Check if budget plan exists for the specified month and year
    const budgetPlan = budgetPlanDao.getByYearAndMonth(year, month);
    if (!budgetPlan) {
      return res.status(400).json({
        code: "budgetPlanDoesNotExist",
        message: "Budget plan for the specified month and year does not exist",
      });
    }

    // Assign budgetPlan ID to the income data
    incomeData.budgetPlanId = budgetPlan.id;

    // Create the income
    const createdIncome = incomeDao.create(incomeData);

    // Include budgetPlan ID in the response
    createdIncome.budgetPlanId = budgetPlan.id;

    // Return the income with budgetPlan ID
    res.json(createdIncome);
  } catch (error) {
    // Handle internal server errors
    res.status(500).json({ code: "internalServerError", message: error.message });
  }
}

module.exports = CreateAbl;