const Ajv = require("ajv");
const ajv = new Ajv();
const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const incomeDao = require("../../dao/income-dao.js");

const schema = {
 type: "object",
 properties: { 
    id: { type: "string" },
    date: { type: "string", format: "date-time" },
    value: {type: "string"},
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

    const updatedincome = incomeDao.update(income);

    if (!updatedincome) {
      res.status(404).json({
        code: "incomeNotFound",
        message: `income ${income.id} not found`,
      });
      return;
    }

    res.json(updatedincome);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;