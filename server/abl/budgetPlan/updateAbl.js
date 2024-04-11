const Ajv = require("ajv");
const ajv = new Ajv();
const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const budgetPlanDao = require("../../dao/budgetPlan-dao.js");
const categoryDao = require("../../dao/category-dao.js");

const schema = {
 type: "object",
 properties: {
  id: { type: "string" },
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
}
};


async function UpdateAbl(req, res) {
  try {
    let budgetPlan = req.body;

    // validate input
    const valid = ajv.validate(schema, budgetPlan);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }
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

// Check if the specified budgetPlan exist
    const updatedbudgetPlan = budgetPlanDao.update(budgetPlan);

    if (!updatedbudgetPlan) {
      res.status(404).json({
        code: "budgetPlanNotFound",
        message: `budgetPlan ${budgetPlan.id} not found`,
      });
      return;
    }

    res.json(updatedbudgetPlan);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;