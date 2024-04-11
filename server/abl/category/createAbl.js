const Ajv = require("ajv");
const ajv = new Ajv();

const categoryDao = require("../../dao/category-dao.js"); 

const schema = {
  type: "object",
  properties: {
    name: {type: "string"}
  },
  required: ["name"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let category = req.body;

    // validate input
    const valid = ajv.validate(schema, category);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }
    const existingCategory = categoryDao.get(category.name);
    if (existingCategory) {
      res.status(400).json({
        code: "categoryAlreadyExists",
        message: "Category with this name already exists",
      });
      return;
    }


    category = categoryDao.create(category);
    res.json(category);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;