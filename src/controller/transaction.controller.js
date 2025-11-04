import { transactionModel } from "../models/transaction.model.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { generateInvoiceNumber } from "../utils/services.js";

export const transactionController = {
  async getBalance(req, res) {
    try {
      const email = req.userEmail;

      // Cek balance
      const balanceData = await transactionModel.getBalanceByEmail(email);
      if (!balanceData) {
        return successResponse(res, 200, "Sukses", { balance: 0 });
      }

      return successResponse(res, 0, "Get Balance Berhasil", balanceData);

    } catch (error) {
      return errorResponse(res, 500, 108, "Terjadi kesalahan pada server");
    }
  },

  async topup(req, res) {
    const client = await transactionModel.getClient();

    try {
      const email = req.userEmail;
      const { top_up_amount } = req.body || {};

      // Cek input kosong
      if (top_up_amount === undefined || top_up_amount === null) {
        return errorResponse(res, 400, 102, "Parameter amount tidak boleh kosong");
      }

      // Cek jenis input
      if (typeof top_up_amount !== "number" || top_up_amount <= 0) {
        return errorResponse(res, 400, 102, "Parameter top_up_amount hanya boleh angka dan tidak boleh lebih kecil dari 0");
      }

      // Mulai transaction
      await client.query("BEGIN");

      // Ambil data user
      const user = await transactionModel.getUserByEmailForUpdate(
        client,
        email
      );

      if (!user) {
        await client.query("ROLLBACK");
        return errorResponse(res, 404, 108, "User tidak ditemukan");
      }

      // Membuat invoice number
      const invoiceNumber = generateInvoiceNumber();

      // Insert ke transaction
      await transactionModel.insertTransaction(
        client,
        user.id,
        invoiceNumber,
        "TOPUP",
        top_up_amount,
        "TOPUP",
        "Top Up balance",
        "Top Up balance"
      );

      // Update balance user
      const currentBalance = parseFloat(user.balance);
      const newBalance = currentBalance + top_up_amount;
      const updatedUser = await transactionModel.updateUserBalance(
        client,
        user.id,
        newBalance
      );

      // Commit transaction
      await client.query("COMMIT");

      return successResponse(res, 0, "Top Up Balance berhasil", {
        balance: updatedUser.balance,
      });
    } catch (error) {
        await client.query("ROLLBACK");
        return errorResponse(res, 500, 108, "Terjadi kesalahan pada server");
    } finally {
        client.release();
    }
  },

  async createTransaction(req, res) {
    const client = await transactionModel.getClient();

    try {
      const email = req.userEmail;
      const { service_code } = req.body;

      // Validasi input
      if (!service_code) {
        return errorResponse(res, 400, 102, "Parameter service_code harus diisi");
      }

      //  Ambil detail service dari db
      const service = await transactionModel.getServiceByCode(service_code);
      if (!service) {
        return errorResponse(res, 400, 102, "Service atau Layanan tidak ditemukan");
      }

      // Parse angka
      const amount = parseFloat(service.service_tarif);

      // Mulai transaction
      await client.query("BEGIN");

      // ambil data user
      const user = await transactionModel.getUserByEmailForUpdate(
        client,
        email
      );
      if (!user) {
        await client.query("ROLLBACK");
        return errorResponse(res, 404, 108, "User tidak ditemukan");
      }

      // Validasi saldo
      const currentBalance = parseFloat(user.balance);
      if (currentBalance < amount) {
        await client.query("ROLLBACK");
        return errorResponse(res, 400, 102, "Saldo tidak mencukupi untuk melakukan pembayaran");
      }

      // Membuat invoice number
      const invoiceNumber = generateInvoiceNumber();

      // Insert transaction record
      const transaction = await transactionModel.insertTransaction(
        client,
        user.id,
        invoiceNumber,
        "PAYMENT",
        amount,
        service_code,
        service.service_name,
        `Payment for ${service.service_name}`
      );

      // Update balance user
      const newBalance = currentBalance - amount;
      await transactionModel.updateUserBalance(client, user.id, newBalance);

      // Commit transaction
      await client.query("COMMIT");

      const result = {
        invoice_number: invoiceNumber,
        service_code: service_code,
        service_name: service.service_name,
        transaction_type: "PAYMENT",
        total_amount: amount,
        created_on: transaction.created_on,
      };

      return successResponse(res, 0, "Transaksi berhasil", result);

    } catch (error) {
      await client.query("ROLLBACK");
      return errorResponse(res, 500, 108, "Terjadi kesalahan pada server");
    } finally {
      client.release();
    }
  },

  async getTransactionHistory(req, res) {
    try {
      const email = req.userEmail;

      // Ambil offset dan limit
      const offset = parseInt(req.query.offset) || 0;
      const limit = parseInt(req.query.limit) || null;

      // Ambil data transaksi
      const transactions = await transactionModel.getTransactionHistory(
        email,
        offset,
        limit
      );

      // Format result
      const result = {
        offset: offset,
        limit: limit,
        records: transactions,
      };

      return successResponse(res, 0, "Get History Berhasil", result);

    } catch (error) {
      return errorResponse(res, 500, 108, "Terjadi kesalahan pada server");
    }
  },
};