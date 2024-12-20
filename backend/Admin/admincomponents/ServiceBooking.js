import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import RNPrint from "react-native-print"; // Import the print library
import HalfTable from "../additionalcomponents/HalfTable";
import Table from "../additionalcomponents/Table";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [retrievedUser, setRetrievedUser] = useState({
    name: "John",
    age: "25",
    email: "john@example.com",
    phone: "123-456-7890",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    password: "",
    longitude: "",
    latitude: "",
  });
  const [emailToDelete, setEmailToDelete] = useState("");
  const [emailToRetrieve, setEmailToRetrieve] = useState("");
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://192.168.100.236:5000/api/serviceBookings/");
      setUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleLoadRow = async (staticInputValue) => {
    console.log("Load Row:", staticInputValue);
    if (!staticInputValue === null || staticInputValue === undefined) {
      Alert.alert("Error", "Please type a user ID to load the row");
      return;
    }
    try {
      const id = staticInputValue;
      const response = await axios.get(`http://192.168.100.236:5000/api/serviceBookings/getrow/${id}`);
      setRetrievedUser(response.data);
      console.log(response.data);
      if (response.status === 400) {
        Alert.alert("Error", "User doesn't exist");
      } else if (response.status === 500) {
        Alert.alert("Error", "Server is not looking good");
      }
    } catch (error) {
      Alert.alert("Error", "Unexpected Error");
    }
  };

  // Add user
  const addUser = async () => {
    try {
      await axios.post("http://localhost:5000/api/serviceBookings/", formData);
      Alert.alert("Success", "User added successfully!");
      fetchUsers();
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        dob: "",
        password: "",
        longitude: "",
        latitude: "",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to add user: " + error.message);
    }
  };

  // Delete user
  const deleteUser = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${emailToDelete}`);
      Alert.alert("Success", "User deleted successfully!");
      fetchUsers();
      setEmailToDelete("");
    } catch (error) {
      Alert.alert("Error", "Failed to delete user: " + error.message);
    }
  };

  // Retrieve user
  const retrieveUser = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${emailToRetrieve}`);
      setRetrievedUser(response.data);
      setEmailToRetrieve("");
    } catch (error) {
      Alert.alert("Error", "Failed to retrieve user: " + error.message);
    }
  };

  // Update user
  const updateUser = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/${retrievedUser.email}`, formData);
      Alert.alert("Success", "User updated successfully!");
      fetchUsers();
      setRetrievedUser(null);
    } catch (error) {
      Alert.alert("Error", "Failed to update user: " + error.message);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setDatePickerVisible(false);
    if (selectedDate) {
      setFormData({ ...formData, dob: selectedDate.toISOString().split("T")[0] });
    }
  };

  // Load initial data
  useEffect(() => {
    fetchUsers();
  }, []);

  // Print table

  const labels = Object.keys(retrievedUser);
  const data = Object.values(retrievedUser);

  // Handle the submission of updated data
  const handleAddData = (updatedData) => {
    console.log("Updated Data:", updatedData);
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>User Management</Text>

        {/* Table */}
        <View style={styles.tableContainer}>
          <Table tableData={users} />
        </View>

        {/* Half Table */}
        <View style={styles.halfTableContainer}>
          <HalfTable labels={labels} data={data} handleAddData={handleAddData} handleLoadRow={handleLoadRow} />
        </View>

        {/* Delete User */}
        <View style={styles.horizontalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email to delete"
            value={emailToDelete}
            onChangeText={setEmailToDelete}
          />
          <Button title="Delete User" onPress={deleteUser} />
        </View>

        {/* Add User */}
        <Text style={styles.subTitle}>Add User</Text>
        <ScrollView horizontal>
          <View style={styles.inputRow}>
            {["name", "email", "phone", "address", "password", "longitude", "latitude"].map((field) => (
              <View key={field} style={styles.inputGroup}>
                <Text style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={`Enter ${field}`}
                  value={formData[field]}
                  onChangeText={(text) => setFormData({ ...formData, [field]: text })}
                />
              </View>
            ))}
            {/* Date Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date of Birth</Text>
              <TextInput
                style={styles.input}
                placeholder="Select DOB"
                value={formData.dob || ""}
                onFocus={() => setDatePickerVisible(true)}
              />
            </View>
          </View>
        </ScrollView>
        <Button title="Add User" onPress={addUser} />

        {datePickerVisible && <DateTimePicker mode="date" display="default" onChange={handleDateChange} />}

        {/* Retrieve & Update User */}
        <Text style={styles.subTitle}>Retrieve User</Text>
        <View style={styles.horizontalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email to retrieve"
            value={emailToRetrieve}
            onChangeText={setEmailToRetrieve}
          />
          <Button title="Retrieve User" onPress={retrieveUser} />
        </View>

        {retrievedUser && (
          <View>
            <Text style={styles.subTitle}>Retrieved User</Text>
            <View style={styles.tableHeader}>
              {Object.keys(retrievedUser).map((key) => (
                <Text key={key} style={[styles.cell, styles.headerCell]}>
                  {String(key) || ""} {/* Ensure that key is a string */}
                </Text>
              ))}
            </View>
            <View style={styles.tableRow}>
              {Object.values(retrievedUser).map((value, i) => (
                <Text key={i} style={styles.cell}>
                  {String(value) || ""} {/* Ensure that value is a string */}
                </Text>
              ))}
            </View>

            <Text style={styles.subTitle}>Update User</Text>
            <ScrollView horizontal>
              <View style={styles.inputRow}>
                {Object.keys(formData).map((key) => (
                  <View key={key} style={styles.inputGroup}>
                    <Text style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder={`Update ${key}`}
                      value={formData[key] || ""}
                      onChangeText={(text) => setFormData({ ...formData, [key]: text })}
                    />
                  </View>
                ))}
              </View>
            </ScrollView>
            <Button title="Update User" onPress={updateUser} />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flex: 1 },
  container: { padding: 10, backgroundColor: "#f4f4f4" },
  title: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  tableContainer: { maxHeight: "40%", borderColor: "#ddd", borderWidth: 1, marginBottom: 10, width: "100%" },
  halfTableContainer: { marginBottom: 10 },
  tableHeader: { flexDirection: "row", backgroundColor: "#2196F3" },
  tableRow: { flexDirection: "row", borderBottomColor: "#ddd", borderBottomWidth: 1 },
  cell: { flex: 1, padding: 10, textAlign: "center", fontSize: 12 },
  headerCell: { fontWeight: "bold", color: "#fff" },
  horizontalContainer: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  inputRow: { flexDirection: "row", alignItems: "flex-start" },
  inputGroup: { marginHorizontal: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 5, width: 150 },
  label: { fontSize: 12, fontWeight: "bold", marginBottom: 5 },
  subTitle: { fontWeight: "bold", fontSize: 16, marginVertical: 5 },
});

export default UserManagement;
