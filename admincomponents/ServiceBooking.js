import React, { useState, useEffect } from "react";
import axios from "axios";

const ServiceBookingTable = () => {
  const [bookings, setBookings] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [newBooking, setNewBooking] = useState({
    customer_id: "",
    provider_id: "",
    service_id: "",
    price: "",
    status: "",
    scheduled_time: "",
    additional_details: "",
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/serviceBookings").then((response) => setBookings(response.data));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/serviceBookings/${id}`)
      .then(() => setBookings(bookings.filter((booking) => booking.id !== id)));
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:5000/api/serviceBookings/${editingBooking.id}`, editingBooking).then(() => {
      setBookings(bookings.map((booking) => (booking.id === editingBooking.id ? editingBooking : booking)));
      setEditingBooking(null);
    });
  };

  const handleAdd = () => {
    axios.post("http://localhost:5000/api/serviceBookings", newBooking).then((response) => {
      setBookings([...bookings, response.data]);
      setNewBooking({
        customer_id: "",
        provider_id: "",
        service_id: "",
        price: "",
        status: "",
        scheduled_time: "",
        additional_details: "",
      });
    });
  };

  return (
    <div>
      <h2>Manage Service Bookings</h2>
      <table>
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Provider ID</th>
            <th>Service ID</th>
            <th>Price</th>
            <th>Status</th>
            <th>Scheduled Time</th>
            <th>Additional Details</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.customer_id}</td>
              <td>{booking.provider_id}</td>
              <td>{booking.service_id}</td>
              <td>{booking.price}</td>
              <td>{booking.status}</td>
              <td>{new Date(booking.scheduled_time).toLocaleString()}</td>
              <td>{booking.additional_details}</td>
              <td>
                <button onClick={() => handleEdit(booking)}>Edit</button>
                <button onClick={() => handleDelete(booking.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Add New Service Booking</h3>
      <input
        placeholder="Customer ID"
        value={newBooking.customer_id}
        onChange={(e) => setNewBooking({ ...newBooking, customer_id: e.target.value })}
      />
      <input
        placeholder="Provider ID"
        value={newBooking.provider_id}
        onChange={(e) => setNewBooking({ ...newBooking, provider_id: e.target.value })}
      />
      <input
        placeholder="Service ID"
        value={newBooking.service_id}
        onChange={(e) => setNewBooking({ ...newBooking, service_id: e.target.value })}
      />
      <input
        placeholder="Price"
        value={newBooking.price}
        onChange={(e) => setNewBooking({ ...newBooking, price: e.target.value })}
      />
      <input
        placeholder="Status"
        value={newBooking.status}
        onChange={(e) => setNewBooking({ ...newBooking, status: e.target.value })}
      />
      <input
        type="datetime-local"
        placeholder="Scheduled Time"
        value={newBooking.scheduled_time}
        onChange={(e) => setNewBooking({ ...newBooking, scheduled_time: e.target.value })}
      />
      <input
        placeholder="Additional Details"
        value={newBooking.additional_details}
        onChange={(e) => setNewBooking({ ...newBooking, additional_details: e.target.value })}
      />
      <button onClick={handleAdd}>Add Service Booking</button>
      {editingBooking && (
        <div>
          <h3>Edit Service Booking</h3>
          <input
            placeholder="Customer ID"
            value={editingBooking.customer_id}
            onChange={(e) => setEditingBooking({ ...editingBooking, customer_id: e.target.value })}
          />
          <input
            placeholder="Provider ID"
            value={editingBooking.provider_id}
            onChange={(e) => setEditingBooking({ ...editingBooking, provider_id: e.target.value })}
          />
          <input
            placeholder="Service ID"
            value={editingBooking.service_id}
            onChange={(e) => setEditingBooking({ ...editingBooking, service_id: e.target.value })}
          />
          <input
            placeholder="Price"
            value={editingBooking.price}
            onChange={(e) => setEditingBooking({ ...editingBooking, price: e.target.value })}
          />
          <input
            placeholder="Status"
            value={editingBooking.status}
            onChange={(e) => setEditingBooking({ ...editingBooking, status: e.target.value })}
          />
          <input
            type="datetime-local"
            placeholder="Scheduled Time"
            value={editingBooking.scheduled_time}
            onChange={(e) => setEditingBooking({ ...editingBooking, scheduled_time: e.target.value })}
          />
          <input
            placeholder="Additional Details"
            value={editingBooking.additional_details}
            onChange={(e) => setEditingBooking({ ...editingBooking, additional_details: e.target.value })}
          />
          <button onClick={handleUpdate}>Update Service Booking</button>
        </div>
      )}
    </div>
  );
};

export default ServiceBookingTable;
