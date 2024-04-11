const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const spendingController = require("./controller/spending");
const myGoalController = require("./controller/myGoal");
const incomeController = require("./controller/income");
const categoryController = require("./controller/category");
const budgetPlanController = require("./controller/budgetPlan");

app.use(express.json()); // podpora pro application/json
app.use(express.urlencoded({ extended: true })); // podpora pro application/x-www-form-urlencoded

app.use(cors());

app.get("/", (req, res) => {
  res.send("Server funguje");
});

app.use("/spending", spendingController);
app.use("/myGoal", myGoalController);
app.use("/income", incomeController);
app.use("/category", categoryController);
app.use("/budgetPlan", budgetPlanController);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});