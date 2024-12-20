const pool = require("./db");

const createServiceBooking = async (booking) => {
  const { customer_id, provider_id, service_id, price, status, scheduled_time, additional_details } = booking;
  const query =
    "INSERT INTO ServiceBookings (customer_id, provider_id, service_id, price, status, scheduled_time, additional_details, createdAt) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *";
  const values = [customer_id, provider_id, service_id, price, status, scheduled_time, additional_details];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getServiceBookings = async () => {
  try {
    const query = "SELECT * FROM ServiceBooking";
    const { rows } = await pool.query(query);
    return rows;
    
  } catch (error) {
    console.error(error);
    return error;
    
  }
  
};

const getServiceBookingById = async (id) => {
  try {
    const query = "SELECT * FROM serviceBooking WHERE provider_id = $1";
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  } catch (error) {
    console.log(error);
    return error;
    
  }
  
};

const updateServiceBooking = async (id, booking) => {
  const { customer_id, provider_id, service_id, price, status, scheduled_time, additional_details } = booking;
  const query =
    "UPDATE serviceBooking SET customer_id = $1, provider_id = $2, service_id = $3, price = $4, status = $5, scheduled_time = $6, additional_details = $7, updatedAt = NOW() WHERE id = $8 RETURNING *";
  const values = [customer_id, provider_id, service_id, price, status, scheduled_time, additional_details, id];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deleteServiceBooking = async (id) => {
  const query = "DELETE FROM ServiceBooking WHERE id = $1 RETURNING *";
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

module.exports = {
  createServiceBooking,
  getServiceBookings,
  getServiceBookingById,
  updateServiceBooking,
  deleteServiceBooking,
};
