const pool = require("./db");

const createUser = async (user) => {
  const { name, phone, email, dateOfBirth, password, address, latitude, longitude } = user;
  const query =
    "INSERT INTO users (name, phone, email, dateOfBirth, password, address, latitude, longitude, createdAt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *";
  const values = [name, phone, email, dateOfBirth, password, address, latitude, longitude];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getUsers = async () => {
  try {
    const query = "SELECT * FROM Users";
    const { rows } = await pool.query(query);
    return rows;
    
  } catch (error) {
    console.error("Query Error: ",error);
    
  }
  
};

const getUserById = async (id) => {
  try {
    const query = "SELECT * FROM Users WHERE email = $1";
    const { rows } = await pool.query(query, [id]);
    return rows[0];
    
  } catch (error) {
    console.error(error);
    
  }
  
};

const updateUser = async (id, user) => {
  const { name, phone, email, dateOfBirth, password, address, latitude, longitude } = user;
  const query =
    "UPDATE Users SET name = $1, phone = $2, email = $3, dateOfBirth = $4, password = $5, address = $6, latitude = $7, longitude = $8, updatedAt = NOW() WHERE id = $9 RETURNING *";
  const values = [name, phone, email, dateOfBirth, password, address, latitude, longitude, id];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deleteUser = async (id) => {
  const query = "DELETE FROM Users WHERE email = $1 RETURNING *";
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
