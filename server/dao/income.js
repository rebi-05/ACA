const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const incomeFolderPath = path.join(__dirname, "storage", "incomeList");

// Method to read an income from a file
function get(incomeId) {
  try {
    const filePath = path.join(incomeFolderPath, `${incomeId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadincome", message: error.message };
  }
}

// Method to write an income to a file
function create(income) {
  try {
    income.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(incomeFolderPath, `${income.id}.json`);
    const fileData = JSON.stringify(income);
    fs.writeFileSync(filePath, fileData, "utf8");
    return income;
  } catch (error) {
    throw { code: "failedToCreateincome", message: error.message };
  }
}

// Method to update income in a file
function update(income) {
  try {
    const currentincome = get(income.id);
    if (!currentincome) return null;
    const newincome = { ...currentincome, ...income };
    const filePath = path.join(incomeFolderPath, `${income.id}.json`);
    const fileData = JSON.stringify(newincome);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newincome;
  } catch (error) {
    throw { code: "failedToUpdateincome", message: error.message };
  }
}

// Method to remove an income from a file
function remove(incomeId) {
  try {
    const filePath = path.join(incomeFolderPath, `${incomeId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { code: "failedToRemoveincome", message: error.message };
  }
}

// Method to list incomes in a folder
function list() {
  try {
    const files = fs.readdirSync(incomeFolderPath);
    const incomeList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(incomeFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });
    return incomeList;
  } catch (error) {
    throw { code: "failedToListincomes", message: error.message };
  }
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
};