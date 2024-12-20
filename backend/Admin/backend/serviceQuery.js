const pool = require("./db");
const createService = async (service) => {
  const { service_name, service_description, category } = service;
  const query =
    "INSERT INTO Services (service_name, service_description, category, createdAt) VALUES ($1, $2, $3, NOW()) RETURNING *";
  const values = [service_name, service_description, category];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getServices = async () => {
  const query = "SELECT * FROM Services";
  const { rows } = await pool.query(query);
  return rows;
};

const getServiceById = async (id) => {
  const query = "SELECT * FROM services WHERE id = $1";
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

const updateService = async (id, service) => {
  const { service_name, service_description, category } = service;
  const query =
    "UPDATE services SET service_name = $1, service_description = $2, category = $3, updatedAt = NOW() WHERE id = $4 RETURNING *";
  const values = [service_name, service_description, category, id];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deleteService = async (id) => {
  const query = "DELETE FROM services WHERE id = $1 RETURNING *";
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
};
