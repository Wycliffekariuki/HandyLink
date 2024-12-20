import React, { useState, useEffect } from "react";
import axios from "axios";

const ServiceTable = () => {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [newService, setNewService] = useState({ service_name: "", service_description: "", category: "" });

  useEffect(() => {
    axios.get("http://localhost:5000/api/services").then((response) => setServices(response.data));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/services/${id}`)
      .then(() => setServices(services.filter((service) => service.id !== id)));
  };

  const handleEdit = (service) => {
    setEditingService(service);
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:5000/api/services/${editingService.id}`, editingService).then(() => {
      setServices(services.map((service) => (service.id === editingService.id ? editingService : service)));
      setEditingService(null);
    });
  };

  const handleAdd = () => {
    axios.post("http://localhost:5000/api/services", newService).then((response) => {
      setServices([...services, response.data]);
      setNewService({ service_name: "", service_description: "", category: "" });
    });
  };

  return (
    <div>
      <h2>Manage Services</h2>
      <table>
        <thead>
          <tr>
            <th>Service Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td>{service.service_name}</td>
              <td>{service.service_description}</td>
              <td>{service.category}</td>
              <td>
                <button onClick={() => handleEdit(service)}>Edit</button>
                <button onClick={() => handleDelete(service.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Add New Service</h3>
      <input
        placeholder="Service Name"
        value={newService.service_name}
        onChange={(e) => setNewService({ ...newService, service_name: e.target.value })}
      />
      <input
        placeholder="Description"
        value={newService.service_description}
        onChange={(e) => setNewService({ ...newService, service_description: e.target.value })}
      />
      <input
        placeholder="Category"
        value={newService.category}
        onChange={(e) => setNewService({ ...newService, category: e.target.value })}
      />
      <button onClick={handleAdd}>Add Service</button>
      {editingService && (
        <div>
          <h3>Edit Service</h3>
          <input
            placeholder="Service Name"
            value={editingService.service_name}
            onChange={(e) => setEditingService({ ...editingService, service_name: e.target.value })}
          />
          <input
            placeholder="Description"
            value={editingService.service_description}
            onChange={(e) => setEditingService({ ...editingService, service_description: e.target.value })}
          />
          <input
            placeholder="Category"
            value={editingService.category}
            onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
          />
          <button onClick={handleUpdate}>Update Service</button>
        </div>
      )}
    </div>
  );
};

export default ServiceTable;
