import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import BookingModal from "./BookingModal";

const ServiceProviderCard = ({ provider }) => {
  const [showModal, setShowModal] = useState(false);

  const handleBookNow = () => {
    setShowModal(true);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{provider.name}</Text>
      <Text>Service: {provider.service}</Text>
      <Text>Rating: {provider.rating}</Text>
      <Button title="Book now" onPress={handleBookNow} color="#007BFF" />
      {showModal && <BookingModal provider={provider} onClose={() => setShowModal(false)} />}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 20,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default ServiceProviderCard;
