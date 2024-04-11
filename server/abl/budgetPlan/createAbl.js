const Ajv = require("ajv");
const ajv = new Ajv();
const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const budgetPlanDao = require("../../dao/budgetPlan-dao.js"); 
const categoryDao = require("../../dao/category-dao.js");

const schema = {
  type: "object",
  properties: {
    year: { type: "integer" },
    month: { type: "integer" },
    categories: {
      type: "array",
      items: {
        type: "object",
        properties: {
          categoryId: { type: "string" },
          budget: { type: "number" }
        },
        required: ["categoryId", "budget"]
      }
    }
  },
  required: ["year", "month", "categories"],
  additionalProperties: false
};

async function CreateAbl(req, res) {
  try {
    let budgetPlanData = req.body;

    // Validate input
    const valid = ajv.validate(schema, budgetPlanData);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

       // Check if a budget plan with the same year and month already exists
       const existingBudgetPlan = budgetPlanDao.getByYearAndMonth(budgetPlanData.year, budgetPlanData.month);
       if (existingBudgetPlan) {
         res.status(400).json({
           code: "budgetPlanAlreadyExists",
           message: "A budget plan for the same year and month already exists",
         });
         return;
       }
    const budgetPlan = {
          year: req.body.year,
          month: req.body.month,
          categories: req.body.categories.map((category) => ({
            categoryId: category.categoryId,
            budget: category.budget,
          })),
        };
    // Check if the specified categories exist
    const categoriesExist = await Promise.all(
      budgetPlan.categories.map(async (category) => {
        const exists = await categoryDao.exists(category.categoryId);
        return { exists, categoryId: category.categoryId };
      })
    );

    if (categoriesExist.some((item) => !item.exists)) {
      const missingCategories = categoriesExist
        .filter((item) => !item.exists)
        .map((item) => item.categoryId);
      res.status(400).json({
        code: "categoryNotFound",
        message: "One or more categories not found",
        missingCategories,
      });
      return;
    }

    // Check if there are duplicate categories
    const categoryIds = new Set();
    for (const category of budgetPlan.categories) {
      if (categoryIds.has(category.categoryId)) {
        res.status(400).json({
          code: "duplicateCategory",
          message: "Duplicate category IDs are not allowed",
        });
        return;
      }
      categoryIds.add(category.categoryId);
    }


    

    // Save the budget plan to DAO storage
    const createdBudgetPlan = budgetPlanDao.create(budgetPlan);
    res.json(createdBudgetPlan);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;