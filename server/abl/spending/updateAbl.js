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
    category: { type: "string" },
    value: {type: "string"},
    message: { type: "string" },
},
required: ["id", "date", "category", "value"],
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
}

module.exports = UpdateAbl;