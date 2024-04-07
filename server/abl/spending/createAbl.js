const Ajv = require("ajv");
const ajv = new Ajv();
const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const spendingDao = require("../../dao/spending-dao.js"); 

const schema = {
  type: "object",
  properties: {
    date: { type: "string", format: "date-time" },
    category: { type: "string" },
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

    spending = spendingDao.create(spending);
    res.json(spending);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;