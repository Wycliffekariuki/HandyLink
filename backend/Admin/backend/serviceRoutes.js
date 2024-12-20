const express = require("express");
const router = express.Router();
const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} = require("./serviceQuery");

// Create a new service
router.post("/", async (req, res) => {
  try {
    const service = await createService(req.body);
    res.status(201).send(service);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all services
router.get("/", async (req, res) => {
  try {
    const services = await getServices();
    res.send(services);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a service by ID
router.get("/:id", async (req, res) => {
  try {
    const service = await getServiceById(req.params.id);
    if (!service) return res.status(404).send();
    res.send(service);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a service by ID
router.put("/:id", async (req, res) => {
  try {
    const service = await updateService(req.params.id, req.body);
    if (!service) return res.status(404).send();
    res.send(service);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a service by ID
router.delete("/:id", async (req, res) => {
  try {
    const service = await deleteService(req.params.id);
    if (!service) return res.status(404).send();
    res.send(service);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
