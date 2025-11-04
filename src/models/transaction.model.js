import pool from "../config/db.js";

export const transactionModel = {
  // Mengambil balance by email
  async getBalanceByEmail(email) {
    const query =
      "SELECT CAST(balance AS INTEGER) AS balance FROM users WHERE lower(email) = lower($1)";
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  // Mengambil user by email dengan FOR UPDATE
  async getUserByEmailForUpdate(client, email) {
    const query = `SELECT id, first_name, balance FROM users WHERE LOWER(email)=LOWER($1) FOR UPDATE`;
    const result = await client.query(query, [email]);
    return result.rows[0];
  },

  async insertTransaction(
    client,
    userId,
    invoiceNumber,
    transactionType,
    amount,
    serviceCode,
    serviceName,
    description
  ) {
    // Insert ke table transaction
    const query = `
      INSERT INTO transactions
        (user_id, invoice_number, transaction_type, description, total_amount, service_code, service_name, created_on)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;
    const result = await client.query(query, [
      userId,
      invoiceNumber,
      transactionType,
      description,
      amount,
      serviceCode,
      serviceName,
    ]);
    return result.rows[0];
  },

  // Update balance user
  async updateUserBalance(client, userId, newBalance) {
    const query = `
      UPDATE users
         SET balance = $1,
             updated_on = NOW()
       WHERE id = $2
   RETURNING CAST(balance AS INTEGER) as balance
    `;
    const result = await client.query(query, [newBalance, userId]);
    return result.rows[0];
  },

  // Mengambil service by code
  async getServiceByCode(service_code) {
    const query =
      "SELECT service_name, service_tarif FROM services WHERE service_code = $1";
    const result = await pool.query(query, [service_code]);
    return result.rows[0];
  },

  // Mengambil user by email
  async getUserByEmail(email) {
    const query =
      "SELECT id, balance FROM users WHERE lower(email) = lower($1)";
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  // Mengambil transaction history
  async getTransactionHistory(email, offset = 0, limit = 0) {
    let query = `
      SELECT 
        t.invoice_number,
        t.transaction_type,
        CASE 
          WHEN t.transaction_type = 'TOPUP' THEN 'TOPUP'
          ELSE COALESCE(t.service_code, '')
        END AS service_code,
        CASE 
          WHEN t.transaction_type = 'TOPUP' THEN 'Top Up balance'
          ELSE COALESCE(t.service_name, '')
        END AS service_name,
        CAST(t.total_amount AS INTEGER) AS total_amount,
        t.created_on
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      WHERE LOWER(u.email) = LOWER($1)
      ORDER BY t.created_on DESC
    `;

    const values = [email];

    if (limit !== null && limit > 0) {
      query += ` LIMIT $${values.length + 1}`;
      values.push(limit);

      if (offset > 0) {
        query += ` OFFSET $${values.length + 1}`;
        values.push(offset);
      }
    } else if (offset > 0) {
      query += ` OFFSET $${values.length + 1}`;
      values.push(offset);
    }

    const result = await pool.query(query, values);
    return result.rows;
  },

  // Helper untuk mendapatkan database client connection
  async getClient() {
    return await pool.connect();
  },
};
