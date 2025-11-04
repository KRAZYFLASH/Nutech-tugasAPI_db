import pool from "../config/db.js";

export const getInformation = {
  async getAllBanners() {
    const query =
      "SELECT banner_name, banner_image, description FROM banners ORDER BY created_on ASC";
    const result = await pool.query(query);
    return result.rows;
  },

  async getAllServices() {
    const query =
      "SELECT service_code, service_name, service_icon, service_tarif FROM services ORDER BY service_name ASC";
    const result = await pool.query(query);

    // mengubah nilai service_tarif ke integer
    return result.rows.map((service) => ({
      ...service,
      service_tarif: parseInt(service.service_tarif),
    }));
  },
};

export default getInformation;
