import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from "react-native";
import axios from "axios";

const ServiceProviderList = ({ service }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [providers, setProviders] = useState([]);

  const handleBook = async () => {
    setModalVisible(true);
    try {
      const response = await axios.get(`http://192.168.100.236:3000/providers?serviceId=${service.id}`);
      if (response.status === 200) {
        setProviders(response.data);
      } else {
        Alert.alert("Error", response.data.error || "An error occurred");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
      console.error(error);
    }
  };

  const renderProvider = ({ item }) => (
    <View style={styles.providerCard}>
      <Text style={styles.providerName}>{item.name}</Text>
      <Text>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{service.service_name}</Text>
      <Text>{service.service_description}</Text>
      <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
        <Text style={styles.bookButtonText}>Book</Text>
      </TouchableOpacity>
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{service.service_name}</Text>
            <Text>{service.service_description}</Text>
            <FlatList data={providers} renderItem={renderProvider} keyExtractor={(item) => item.id.toString()} />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bookButton: {
    marginTop: 10,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  bookButtonText: {
    color: "white",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  providerCard: {
    backgroundColor: "#f0f4f8",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  providerName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    textAlign: "center",
  },
});

export default ServiceProviderList;
