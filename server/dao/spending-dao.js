const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const spendingFolderPath = path.join(__dirname, "storage", "spendingList");

// Method to read an spending from a file
function get(spendingId) {
  try {
    const filePath = path.join(spendingFolderPath, `${spendingId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadspending", message: error.message };
  }
}

// Method to write an spending to a file
function create(spending) {
  try {
    spending.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(spendingFolderPath, `${spending.id}.json`);
    const fileData = JSON.stringify(spending);
    fs.writeFileSync(filePath, fileData, "utf8");
    return spending;
  } catch (error) {
    throw { code: "failedToCreatespending", message: error.message };
  }
}

// Method to update spending in a file
function update(spending) {
  try {
    const currentspending = get(spending.id);
    if (!currentspending) return null;
    const newspending = { ...currentspending, ...spending };
    const filePath = path.join(spendingFolderPath, `${spending.id}.json`);
    const fileData = JSON.stringify(newspending);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newspending;
  } catch (error) {
    throw { code: "failedToUpdatespending", message: error.message };
  }
}

// Method to remove an spending from a file
function remove(spendingId) {
  try {
    const filePath = path.join(spendingFolderPath, `${spendingId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { code: "failedToRemovespending", message: error.message };
  }
}

// Method to list spendings in a folder
function list() {
  try {
    const files = fs.readdirSync(spendingFolderPath);
    const spendingList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(spendingFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });
    return spendingList;
  } catch (error) {
    throw { code: "failedToListspendings", message: error.message };
  }
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
};