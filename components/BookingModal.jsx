import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Modal } from "react-native";
import { useDispatch } from "react-redux";
import { bookService } from "../actions/bookingActions";

const BookingModal = ({ provider, onClose }) => {
  const [details, setDetails] = useState("");
  const dispatch = useDispatch();

  const handleBook = () => {
    dispatch(bookService(provider.id, details));
    onClose();
  };

  return (
    <Modal transparent={true} animationType="slide" visible={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Booking for {provider.name}</Text>
          <TextInput
            style={styles.textArea}
            value={details}
            onChangeText={setDetails}
            placeholder="Enter booking details"
            multiline={true}
          />
          <View style={styles.modalButtons}>
            <Button title="Confirm Booking" onPress={handleBook} color="#28A745" />
            <Button title="Close" onPress={onClose} color="#FF6347" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  textArea: {
    width: "100%",
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default BookingModal;
