const {
  addExpense,
  getExpense,
  deleteExpense,
} = require("../controllers/expense");
const {
  addIncome,
  getIncomes,
  deleteIncome,
  getFilteredIncomeAndExpenses,
} = require("../controllers/income");

const router = require("express").Router();
const { middleware } = require("../controllers/middleware");

router.post("/add-income", middleware, addIncome);
router.get("/get-incomes", middleware, getIncomes);
router.delete("/delete-income/:id", middleware, deleteIncome);
router.get('/filteredData', middleware, getFilteredIncomeAndExpenses)
router.post("/add-expense", middleware, addExpense);
router.get("/get-expenses", middleware, getExpense);
router.delete("/delete-expense/:id", middleware, deleteExpense);

module.exports = router;
