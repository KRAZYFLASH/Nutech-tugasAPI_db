import express from "express";
import { transactionController } from "../controller/transaction.controller.js";
import { authUser } from "../middlewares/auth.js";

const transactionRouter = express.Router();

transactionRouter.get("/balance", authUser, transactionController.getBalance);
transactionRouter.post("/topup", authUser, transactionController.topup);
transactionRouter.post(
  "/transaction",
  authUser,
  transactionController.createTransaction
);
transactionRouter.get(
  "/transaction/history",
  authUser,
  transactionController.getTransactionHistory
);

export { transactionRouter };
