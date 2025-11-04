import bcrypt from "bcryptjs";

import pool from "../config/db.js";

export const membershipModel = {
  async createUser(userData) {
    const { email, hashedPassword, first_name, last_name } = userData;

    const query =
      "INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4)";

    const values = [email, hashedPassword, first_name, last_name];
    const result = await pool.query(query, values);
    return result;
  },

  async findUserByEmail(email) {
    const query = "SELECT * FROM users WHERE lower(email) = lower($1)";
    const result = await pool.query(query, [email]);
    return result.rowCount > 0;
  },

  async loginCheck(email, password) {
    const query = "SELECT password FROM users WHERE lower(email) = lower($1)";
    const result = await pool.query(query, [email]);

    if (result.rowCount === 0) {
      return false;
    }

    const isValidPassword = await bcrypt.compare(
      password,
      result.rows[0].password
    );

    return isValidPassword;
  },

  async getProfile(email) {
    const query =
      "SELECT email, first_name, last_name, profile_image from users WHERE lower(email) = lower($1)";
    const result = await pool.query(query, [email]);

    return result.rows[0];
  },

  async updateProfile(email, profileData) {
    const { first_name, last_name } = profileData;
    const query =
      "UPDATE users SET first_name = $1, last_name = $2, updated_on = CURRENT_TIMESTAMP WHERE lower(email) = lower($3) returning email, first_name, last_name, profile_image";

    const values = [first_name, last_name, email];
    const result = await pool.query(query, values);

    return result.rows[0];
  },

  async updateProfileImage(email, imageUrl) {
    const query =
      "UPDATE users SET profile_image = $1, updated_on = CURRENT_TIMESTAMP WHERE lower(email) = lower($2) RETURNING email, first_name, last_name, profile_image";
    const values = [imageUrl, email];
    const result = await pool.query(query, values);

    return result.rows[0];
  },
};
