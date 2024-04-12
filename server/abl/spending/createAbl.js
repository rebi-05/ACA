const Ajv = require("ajv");
const ajv = new Ajv();
const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const spendingDao = require("../../dao/spending-dao.js"); 
const budgetPlanDao = require("../../dao/budgetPlan-dao.js"); 
const categoryDao = require("../../dao/category-dao.js");

const schema = {
  type: "object",
  properties: {
    date: { type: "string", format: "date-time" },
    categoryId: { type: "string" }, 
    value: {type: "number"},
    message: { type: "string" },
  },
  required: ["date", "categoryId", "value"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let spendingData = req.body;

    // Validate input against schema
    const valid = ajv.validate(schema, spendingData);
    if (!valid) {
      return res.status(400).json({
        code: "invalidRequest",
        message: "Invalid request data",
        validationErrors: ajv.errors,
      });
    }

    // Extract month and year from spending date
    const month = new Date(spendingData.date).getMonth() + 1;
    const year = new Date(spendingData.date).getFullYear();

    // Check if budget plan exists for the specified month and year
    const budgetPlan = budgetPlanDao.getByYearAndMonth(year, month);
    if (!budgetPlan) {
      return res.status(400).json({
        code: "budgetPlanDoesNotExist",
        message: "Budget plan for the specified month and year does not exist",
      });
    }

    // Check if category exists using its ID
    const categoryExists = await categoryDao.exists(spendingData.categoryId);
    if (!categoryExists) {
      return res.status(400).json({
        code: "categoryDoesNotExist",
        message: "Category with the specified ID does not exist",
      });
    }

    // Assign budgetPlan ID to the spending data
    spendingData.budgetPlanId = budgetPlan.id;

    // Create the spending
    const createdSpending = spendingDao.create(spendingData);

    // Include budgetPlan ID in the response
    createdSpending.budgetPlanId = budgetPlan.id;

    // Return the spending with budgetPlan ID
    res.json(createdSpending);
  } catch (error) {
    // Handle internal server errors
    res.status(500).json({ code: "internalServerError", message: error.message });
  }
}
module.exports = CreateAbl;