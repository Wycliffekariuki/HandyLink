import React, { useState, useEffect } from "react";
import axios from "axios";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    password: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/users").then((response) => setUsers(response.data));
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/users/${id}`).then(() => setUsers(users.filter((user) => user.id !== id)));
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:5000/api/users/${editingUser.id}`, editingUser).then(() => {
      setUsers(users.map((user) => (user.id === editingUser.id ? editingUser : user)));
      setEditingUser(null);
    });
  };

  const handleAdd = () => {
    axios.post("http://localhost:5000/api/users", newUser).then((response) => {
      setUsers([...users, response.data]);
      setNewUser({
        name: "",
        phone: "",
        email: "",
        dateOfBirth: "",
        password: "",
        address: "",
        latitude: "",
        longitude: "",
      });
    });
  };

  return (
    <div>
      <h2>Manage Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Date of Birth</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.phone}</td>
              <td>{user.email}</td>
              <td>{new Date(user.dateOfBirth).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Add New User</h3>
      <input
        placeholder="Name"
        value={newUser.name}
        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
      />
      <input
        placeholder="Phone"
        value={newUser.phone}
        onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
      />
      <input
        placeholder="Email"
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
      />
      <input
        type="date"
        placeholder="Date of Birth"
        value={newUser.dateOfBirth}
        onChange={(e) => setNewUser({ ...newUser, dateOfBirth: e.target.value })}
      />
      <input
        placeholder="Password"
        value={newUser.password}
        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
      />
      <input
        placeholder="Address"
        value={newUser.address}
        onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
      />
      <input
        placeholder="Latitude"
        value={newUser.latitude}
        onChange={(e) => setNewUser({ ...newUser, latitude: e.target.value })}
      />
      <input
        placeholder="Longitude"
        value={newUser.longitude}
        onChange={(e) => setNewUser({ ...newUser, longitude: e.target.value })}
      />
      <button onClick={handleAdd}>Add User</button>
      {editingUser && (
        <div>
          <h3>Edit User</h3>
          <input
            placeholder="Name"
            value={editingUser.name}
            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
          />
          <input
            placeholder="Phone"
            value={editingUser.phone}
            onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
          />
          <input
            placeholder="Email"
            value={editingUser.email}
            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
          />
          <input
            type="date"
            placeholder="Date of Birth"
            value={editingUser.dateOfBirth}
            onChange={(e) => setEditingUser({ ...editingUser, dateOfBirth: e.target.value })}
          />
          <input
            placeholder="Password"
            value={editingUser.password}
            onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
          />
          <input
            placeholder="Address"
            value={editingUser.address}
            onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
          />
          <input
            placeholder="Latitude"
            value={editingUser.latitude}
            onChange={(e) => setEditingUser({ ...editingUser, latitude: e.target.value })}
          />
          <input
            placeholder="Longitude"
            value={editingUser.longitude}
            onChange={(e) => setEditingUser({ ...editingUser, longitude: e.target.value })}
          />
          <button onClick={handleUpdate}>Update User</button>
        </div>
      )}
    </div>
  );
};

export default UserTable;
