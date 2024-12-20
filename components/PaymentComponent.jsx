import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, ScrollView, Alert } from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import store from "../ReduxComonents/app/store";

const PaymentComponent = ({ onClose, onComplete }) => {
  const chosenService = useSelector((state) => state.user.choosenServices);
  const chosenServiceProvider = useSelector((state) => state.user.choosenServiceProvider);

  const [paymentMethod, setPaymentMethod] = useState("Mpesa");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handlePay = () => {
    alert("Payment initiated!");
  };

const handleCompletePayment = async () => {
  if (!phoneNumber) {
    Alert.alert("Validation Error", "Phone number cannot be empty.");
    return;
  }
    
  const userData = store.getState().user.userData;
  const providerprice = store.getState().user.choosenServiceProvider;
  const payedService = store.getState().user.choosenServices;
  

  var data = {
    userData,
    providerprice,
    phoneNumber,
    payedService,
  };

  console.log("Complete Payment with Phone Number:", phoneNumber);
  console.log(chosenServiceProvider.price);
  console.log(userData);
  try {
    const response = await axios.post("http://192.168.100.236:3000/payment", data);
    if (response.status === 200) {
      Alert.alert("Transaction success");
      
      const transactionID = response.data.transactionData;
      /*
       const obj = { userData, providerprice, payedService, transactionID };
      const responseBooking = await axios.post("http://192.168.100.236:3000/booking", obj);
      if (responseBooking.status === 200) {
        Alert.alert(responseBooking.data.message);
      } else {
        Alert.alert("Error", responseBooking.data.error);
      }
      */
    } else if (response.status === 500) {
      Alert.alert("Error occurred", response.error);
    }
  } catch (error) {
    console.error("Error completing payment:", error);
    Alert.alert("Error occurred");
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.serviceName}>{chosenService?.service_name || "No Service Selected"}</Text>
      <Text style={styles.providerName}>Provider: {chosenServiceProvider?.name || "No Provider Selected"}</Text>
      <Text style={styles.price}>Price: {chosenServiceProvider?.price || "N/A"} USD</Text>

      <Text style={styles.sectionTitle}>Service Description:</Text>
      <Text>{chosenService?.service_description || "No description available."}</Text>

      <Text style={styles.sectionTitle}>Payment Method</Text>
      <View style={styles.paymentMethodContainer}>
        <TouchableOpacity
          style={[styles.paymentMethodButton, paymentMethod === "Mpesa" && styles.selectedPaymentMethodButton]}
          onPress={() => handlePaymentMethodChange("Mpesa")}
        >
          <Text style={styles.paymentMethodText}>Mpesa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.paymentMethodButton, paymentMethod === "DebitCard" && styles.selectedPaymentMethodButton]}
          onPress={() => handlePaymentMethodChange("DebitCard")}
        >
          <Text style={styles.paymentMethodText}>Debit Card</Text>
        </TouchableOpacity>
      </View>

      {paymentMethod === "Mpesa" && (
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      )}

      {paymentMethod === "DebitCard" && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Card Number"
            keyboardType="numeric"
            value={cardNumber}
            onChangeText={setCardNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="Expiry Date (MM/YY)"
            keyboardType="numeric"
            value={expiryDate}
            onChangeText={setExpiryDate}
          />
          <TextInput
            style={styles.input}
            placeholder="CVV"
            keyboardType="numeric"
            secureTextEntry
            value={cvv}
            onChangeText={setCvv}
          />
        </>
      )}

      <TouchableOpacity style={styles.payButton} onPress={handlePay}>
        <Text style={styles.buttonText}>Pay</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.completeButton} onPress={handleCompletePayment}>
        <Text style={styles.buttonText}>Complete Payment</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.buttonText}>Close</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  providerName: {
    fontSize: 18,
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  paymentMethodContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  paymentMethodButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#007BFF",
    marginHorizontal: 5,
    alignItems: "center",
  },
  selectedPaymentMethodButton: {
    backgroundColor: "#007BFF",
  },
  paymentMethodText: {
    color: "#fff",
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
  },
  payButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  completeButton: {
    backgroundColor: "#17a2b8",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#dc3545",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default PaymentComponent;
