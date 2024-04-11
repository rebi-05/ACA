const Ajv = require("ajv");
const ajv = new Ajv();
const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const spendingDao = require("../../dao/spending-dao.js"); 

const schema = {
  type: "object",
  properties: {
    date: { type: "string", format: "date-time" },
    category: { type: "string" }, //TODO propojit s category
    value: {type: "string"},
    message: { type: "string" },
  },
  required: ["date", "category", "value"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let spending = req.body;

    // validate input
    const valid = ajv.validate(schema, spending);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // Get the budget plan for the given month and year
    const month = new Date(spending.date).getMonth() + 1; // Months are zero-based
    const year = new Date(spending.date).getFullYear();
    const budgetPlan = budgetPlanDao.getByMonthAndYear(month, year);

    // If budget plan not found, handle appropriately (e.g., return an error)
    if (!budgetPlan) {
      res.status(400).json({
        code: "budgetPlanNotFound",
        message: "Budget plan not found for the specified month and year",
      });
      return;
    }

    // Assign budgetPlan ID to the spending
    spending.budgetPlanId = budgetPlan.id;

    // Create the spending
    spending = spendingDao.create(spending);

    // Include budgetPlan ID in the response
    spending.budgetPlanId = budgetPlan.id;

    // Return the spending with budgetPlan ID
    res.json(spending);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;