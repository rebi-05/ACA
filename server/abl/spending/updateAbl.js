const Ajv = require("ajv");
const ajv = new Ajv();
const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const spendingDao = require("../../dao/spending-dao.js");

const schema = {
 type: "object",
 properties: { 
    id: { type: "string" },
    date: { type: "string", format: "date-time" },
    categoryId: { type: "string" },
    value: {type: "number"},
    message: { type: "string" },
},
required: ["id", "date", "categoryId", "value"],
additionalProperties: false,
};


async function UpdateAbl(req, res) {
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

    const updatedspending = spendingDao.update(spending);

    if (!updatedspending) {
      res.status(404).json({
        code: "spendingNotFound",
        message: `spending ${spending.id} not found`,
      });
      return;
    }

    res.json(updatedspending);
  } catch (e) {
    res.status(500).json({ message: e.message });
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

}

module.exports = UpdateAbl;