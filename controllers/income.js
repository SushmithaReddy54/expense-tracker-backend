const IncomeSchema = require("../models/IncomeModel");
const ExpenseSchema = require("../models/ExpenseModel");

exports.addIncome = async (req, res) => {
  const { title, amount, category, description, date } = req.body;
  const userId = req.user._id;
  const income = IncomeSchema({
    title,
    amount,
    category,
    description,
    date,
    createdBy: userId,
  });

  try {
    //validations
    if (!title || !category || !description || !date) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (amount <= 0 || !amount === "number") {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number!" });
    }
    await income.save();
    res.status(200).json({ message: "Income Added" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getIncomes = async (req, res) => {
  const userId = req.user._id;
  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  try {
    const incomes = await IncomeSchema.find({
      createdBy: userId,
      date: {
        $gte: firstDayOfMonth,
        $lte: currentDate,
      },
    }).sort({ createdAt: -1 });

    res.status(200).json(incomes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getFilteredIncomeAndExpenses = async (req, res) => {
    const userId = req.user._id;
    const { minDate, maxDate } = req.query;
    console.log(minDate, maxDate);
    if(!minDate || !maxDate){
        res.status(400).json("need required data");
    }
    try {
      const incomes = await IncomeSchema.find({
        createdBy: userId,
        date: {
          $gte: minDate,
          $lte: maxDate,
        },
      }).sort({ createdAt: -1 });
      const expenses = await ExpenseSchema.find({
        createdBy: userId,
        date: {
          $gte: minDate,
          $lte: maxDate,
        },
      }).sort({ createdAt: -1 });
  
      res.status(200).json(incomes.concat(expenses));
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  };

exports.deleteIncome = async (req, res) => {
  const { id } = req.params;
  IncomeSchema.findByIdAndDelete(id)
    .then((income) => {
      res.status(200).json({ message: "Income Deleted" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Server Error" });
    });
};
