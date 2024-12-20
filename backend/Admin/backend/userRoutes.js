const express = require("express");
const router = express.Router();
const { createUser, getUsers, getUserById, updateUser, deleteUser } = require("./userQuery");

// Create a new user
router.post("/add", async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
    console.error(error)
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await getUsers();
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a user by ID
router.get("/getrow/:id", async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).send();
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a user by ID
router.put("/update/:id", async (req, res) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    if (!user) return res.status(404).send();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a user by ID
router.delete("/delete/:emailToDelete", async (req, res) => {
  try {
    const user = await deleteUser(req.params.emailToDelete);
    if (!user) return res.status(404).send();
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
