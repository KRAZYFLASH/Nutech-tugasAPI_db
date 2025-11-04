import { membershipModel } from "../models/membership.model.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { generateToken } from "../middlewares/auth.js";
import { v2 as cloudinary } from "cloudinary";

import bcrypt from "bcryptjs";
import validator from "validator";

export const membershipController = {
  async register(req, res) {
    try {
      const { email, password, first_name, last_name } = req.body;

      // Validator
      if (!validator.isEmail(email)) {
        return errorResponse(res, 102, "Paramter email tidak sesuai format");
      }

      if (!validator.isLength(password, { min: 8 })) {
        return errorResponse(res, 102, "Password length minimal 8 karakter");
      }

      // Cek email terdaftar
      const existingUser = await membershipModel.findUserByEmail(email);
      if (existingUser) {
        return errorResponse(res, 102, "Email sudah terdaftar");
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Buat user baru
      await membershipModel.createUser({
        email,
        hashedPassword,
        first_name,
        last_name,
      });

      return successResponse(res, 200, "Registrasi berhasil silahkan login", null);
    } catch (error) {
      return errorResponse(res, 500, "Terjadi kesalahan pada server");
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validator
      if (!email || !password) {
        return errorResponse(res, 400, 102, "Parameter email harus di isi");
      }

      if (!validator.isEmail(email)) {
        return errorResponse(res, 400, 102, "Paramter email tidak sesuai format");
      }

      // Cek password & email
      const user = await membershipModel.loginCheck(email, password);

      if (!user) {
        return errorResponse(res, 401, 103, "Username atau password salah");
      }

      // Generate JWT Token
      const token = generateToken(email);

      return successResponse(res, 0, "Login berhasil", { token: token });
    } catch (error) {
      return errorResponse(res, 500, 400, "Terjadi kesalahan pada server");
    }
  },

  async getProfile(req, res) {
    try {
      const email = req.userEmail;

      // Ambil profile user
      const userProfile = await membershipModel.getProfile(email);
      if (!userProfile) {
        return errorResponse(res, 404, null, "User tidak ditemukan");
      }

      return successResponse(res, 0, "Profile user ditemukan", userProfile);
    } catch (error) {
      return errorResponse(res, 500, 400, "Terjadi kesalahan pada server");
    }
  },

  async updateProfile(req, res) {
    try {
      const email = req.userEmail;
      const { first_name, last_name } = req.body;

      // Cek input
      if (!first_name || !last_name) {
        return errorResponse(res, 400, 102, "first_name dan last_name harus diisi");
      }

      // Update profile
      const updatedProfile = await membershipModel.updateProfile(email, {
        first_name,
        last_name,
      });

      // Cek User
      if (updatedProfile.rowCount === 0) {
        return errorResponse(res, 404, null,"User tidak ditemukan");
      }

      return successResponse(res, 200, 0, "update profile berhasil", updatedProfile);
    } catch (error) {
      return errorResponse(res, 500, null, "Terjadi kesalahan pada server");
    }
  },

  async uploadProfileImage(req, res) {
    try {
      const file = req.file;

      // Cek file kosong
      if (!file) {
        return errorResponse(res, 400, 102, "Field file tidak boleh kosong");
      }

      // Cek jenis file
      const allowed = new Set([
        "image/jpeg",
        "image/png",
      ]);

      if (!allowed.has(file.mimetype)) {
        return errorResponse(res, 400, 102, "Format image tidak sesuai");
      }

      // Upload di Cloudinary
      const imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profile_images", resource_type: "image" },
          (err, result) => (err ? reject(err) : resolve(result.secure_url))
        );
        stream.end(file.buffer);
      });

      // Update profile image
      const updated = await membershipModel.updateProfileImage(
        req.userEmail,
        imageUrl
      );

      return successResponse(res, 200, 0, "Upload profile image berhasil", { profile_image: updated });
    } catch (err) {
      return errorResponse(res, 500, "Terjadi kesalahan pada server");
    }
  },
};