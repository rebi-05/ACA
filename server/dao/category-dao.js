const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const categoryFolderPath = path.join(__dirname, "storage", "categoryList");

// Method to check if a category exists by ID
function exists(categoryId) {
  try {
    const files = fs.readdirSync(categoryFolderPath);
    const categoryFile = files.find((file) => {
      const fileData = fs.readFileSync(path.join(categoryFolderPath, file), "utf8");
      const category = JSON.parse(fileData);
      return category.id === categoryId;
    });
    return !!categoryFile; // Return true if the category file is found, otherwise false
  } catch (error) {
    throw { code: "failedToCheckCategoryExistence", message: error.message };
  }
}


// Method to read an category from a file
function get(categoryName) {
  try {
    const files = fs.readdirSync(categoryFolderPath);
    const categoryFile = files.find((file) => {
      const fileData = fs.readFileSync(path.join(categoryFolderPath, file), "utf8");
      const category = JSON.parse(fileData);
      return category.name === categoryName;
    });
    if (!categoryFile) return null;
    const fileData = fs.readFileSync(path.join(categoryFolderPath, categoryFile), "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    throw { code: "failedToReadcategory", message: error.message };
  }
}

// Method to write an category to a file
function create(category) {
  try {
    category.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(categoryFolderPath, `${category.id}.json`);
    const fileData = JSON.stringify(category);
    fs.writeFileSync(filePath, fileData, "utf8");
    return category;
  } catch (error) {
    throw { code: "failedToCreatecategory", category: error.category };
  }
}

// Method to list categorys in a folder
function list() {
  try {
    const files = fs.readdirSync(categoryFolderPath);
    const categoryList = files.map((file) => {
      const fileData = fs.readFileSync(path.join(categoryFolderPath, file), "utf8");
      return JSON.parse(fileData);
    });
    return categoryList;
  } catch (error) {
    throw { code: "failedToListcategorys", category: error.category };
  }
}

module.exports = {
  get,
  create,
  list,
  exists,
};
