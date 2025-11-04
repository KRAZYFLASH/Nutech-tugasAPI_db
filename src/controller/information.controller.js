import { getInformation } from "../models/information.model.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const informationController = {
  async getBanners(req, res) {
    try {
      // Mengambil banner
      const banner = await getInformation.getAllBanners();
      return successResponse(res, 0, "Sukses", banner);
    } catch (error) {
      return errorResponse(res, 500, "Terjadi kesalahan pada server");
    }
  },

  async getServices(req, res) {
    try {
      // Mengambil services
      const services = await getInformation.getAllServices();
      return successResponse(res, 0, "Sukses", services);
    } catch (error) {
      return errorResponse(res, 500, "Terjadi kesalahan pada server");
    }
  },
};
