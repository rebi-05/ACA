const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const budgetPlanFolderPath = path.join(__dirname, "storage", "budgetPlanList");

// Method to read an budgetPlan from a file
function get(budgetPlanId) {
  try {
    const filePath = path.join(budgetPlanFolderPath, `${budgetPlanId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadbudgetPlan", message: error.message };
  }
}

// Method to write an budgetPlan to a file
function create(budgetPlan) {
  try {
    budgetPlan.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(budgetPlanFolderPath, `${budgetPlan.id}.json`);
    const fileData = JSON.stringify(budgetPlan);
    fs.writeFileSync(filePath, fileData, "utf8");
    return budgetPlan;
  } catch (error) {
    throw { code: "failedToCreatebudgetPlan", message: error.message };
  }
}

// Method to update budgetPlan in a file
function update(budgetPlan) {
  try {
    const currentbudgetPlan = get(budgetPlan.id);
    if (!currentbudgetPlan) return null;
    const newbudgetPlan = { ...currentbudgetPlan, ...budgetPlan };
    const filePath = path.join(budgetPlanFolderPath, `${budgetPlan.id}.json`);
    const fileData = JSON.stringify(newbudgetPlan);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newbudgetPlan;
  } catch (error) {
    throw { code: "failedToUpdatebudgetPlan", message: error.message };
  }
}

// Method to remove an budgetPlan from a file
function remove(budgetPlanId) {
  try {
    const filePath = path.join(budgetPlanFolderPath, `${budgetPlanId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { code: "failedToRemovebudgetPlan", message: error.message };
  }
}

// Method to list budgetPlans in a folder
function list() {
  try {
    const files = fs.readdirSync(budgetPlanFolderPath);
    const budgetPlanList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(budgetPlanFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });
    return budgetPlanList;
  } catch (error) {
    throw { code: "failedToListbudgetPlans", message: error.message };
  }
}

function getByYearAndMonth(year, month) {
  try {
    const files = fs.readdirSync(budgetPlanFolderPath);
    const matchingPlan = files.find((file) => {
      const fileData = fs.readFileSync(path.join(budgetPlanFolderPath, file), "utf8");
      const budgetPlan = JSON.parse(fileData);
      return budgetPlan.year === year && budgetPlan.month === month;
    });
    if (!matchingPlan) return null;
    const fileData = fs.readFileSync(path.join(budgetPlanFolderPath, matchingPlan), "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    throw { code: "failedToRetrieveBudgetPlan", message: error.message };
  }
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
  getByYearAndMonth,
};