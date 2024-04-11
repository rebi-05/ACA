
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const myGoalFolderPath = path.join(__dirname, "storage", "myGoalList");

// Method to read an myGoal from a file
function get(myGoalId) {
  try {
    const filePath = path.join(myGoalFolderPath, `${myGoalId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadmyGoal", myGoal: error.myGoal };
  }
}

// Method to write an myGoal to a file
function create(myGoal) {
  try {
    myGoal.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(myGoalFolderPath, `${myGoal.id}.json`);
    const fileData = JSON.stringify(myGoal);
    fs.writeFileSync(filePath, fileData, "utf8");
    return myGoal;
  } catch (error) {
    throw { code: "failedToCreatemyGoal", myGoal: error.myGoal };
  }
}

// Method to update myGoal in a file
function update(myGoal) {
  try {
    const currentmyGoal = get(myGoal.id);
    if (!currentmyGoal) return null;
    const newmyGoal = { ...currentmyGoal, ...myGoal };
    const filePath = path.join(myGoalFolderPath, `${myGoal.id}.json`);
    const fileData = JSON.stringify(newmyGoal);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newmyGoal;
  } catch (error) {
    throw { code: "failedToUpdatemyGoal", myGoal: error.myGoal };
  }
}

// Method to remove an myGoal from a file
function remove(myGoalId) {
  try {
    const filePath = path.join(myGoalFolderPath, `${myGoalId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { code: "failedToRemovemyGoal", myGoal: error.myGoal };
  }
}

// Method to list myGoals in a folder
function list() {
  try {
    const files = fs.readdirSync(myGoalFolderPath);
    const myGoalList = files.map((file) => {
      const fileData = fs.readFileSync(path.join(myGoalFolderPath, file), "utf8");
      return JSON.parse(fileData);
    });
    return myGoalList;
  } catch (error) {
    throw { code: "failedToListmyGoals", myGoal: error.myGoal };
  }
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
};
