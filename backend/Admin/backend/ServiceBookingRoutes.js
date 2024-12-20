const express = require("express");
const router = express.Router();
const {
  createServiceBooking,
  getServiceBookings,
  getServiceBookingById,
  updateServiceBooking,
  deleteServiceBooking,
} = require("./serviceBookingQuery");

// Create a new service booking
router.post("/add", async (req, res) => {
  try {
    const booking = await createServiceBooking(req.body);
    res.status(201).send(booking);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all service bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await getServiceBookings();
    res.send(bookings);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a service booking by ID
router.get("/getrow/:id", async (req, res) => {
  try {
    const booking = await getServiceBookingById(req.params.id);
    if (!booking) return res.status(404).send();
    res.send(booking);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a service booking by ID
router.put("update/:id", async (req, res) => {
  try {
    const booking = await updateServiceBooking(req.params.id, req.body);
    if (!booking) return res.status(404).send();
    res.send(booking);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a service booking by ID
router.delete("/delete/:emailToDelete", async (req, res) => {
  try {
    const booking = await deleteServiceBooking(req.params.id);
    if (!booking) return res.status(404).send();
    res.send(booking);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
