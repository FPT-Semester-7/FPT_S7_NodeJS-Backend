const Transaction = require("../models/Transaction");

const ensureAuthenticatedUser = (req, res) => {
  if (!req.user || !req.user.id) {
    res
      .status(401)
      .json({ status: "fail", message: "Authentication required" });
    return false;
  }
  return true;
};

exports.createPayment = async (req, res) => {
  try {
    if (!ensureAuthenticatedUser(req, res)) return;
    const newPayment = await Transaction.create(req.body);
    res
      .status(201)
      .json({ status: "success", data: { transaction: newPayment } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    if (!ensureAuthenticatedUser(req, res)) return;
    const userId = req.params.userId;
    const transactions = await Transaction.find({
      $or: [{ client: userId }, { mc: userId }],
    });
    res
      .status(200)
      .json({
        status: "success",
        results: transactions.length,
        data: { transactions },
      });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    if (!ensureAuthenticatedUser(req, res)) return;
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );
    if (!transaction)
      return res
        .status(404)
        .json({ status: "fail", message: "Transaction not found" });
    res.status(200).json({ status: "success", data: { transaction } });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};
