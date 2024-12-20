import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setchoosenServiceProvider } from "../ReduxComonents/features/userSlice";
import PaymentComponent from "./PaymentComponent";

const { width } = Dimensions.get("window");

const ServiceCard = ({ service, onBack }) => {
  const dispatch = useDispatch();
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const providers = useSelector((state) => state.user.serviceProviders);

  const providerArray = Object.values(providers);

  const serviceDetails = Object.entries(service).filter(
    ([key]) =>
      key !== "service_id" &&
      key !== "created_at" &&
      key !== "service_name" &&
      key !== "service_description" &&
      key !== "providers",
  );

  const handleProviderClick = (provider) => {
    setSelectedProvider(provider);
    dispatch(setchoosenServiceProvider(provider));
  };

  const handlePayNowClick = () => {
    if (!selectedProvider) {
      alert("Please select a provider before proceeding to payment.");
      return;
    }
    setShowPayment(true);
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleCompletePayment = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowPayment(false);
      alert("Payment completed successfully!");
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, { transform: [{ translateX: slideAnim }] }]}>
        <Text style={styles.cardTitle}>{service.service_name}</Text>
        <Text style={styles.cardDescription}>{service.service_description}</Text>

        <Text style={styles.sectionTitle}>Service Details:</Text>
        {serviceDetails.map(([key, value], index) => (
          <View key={index} style={styles.detailRow}>
            <Text style={styles.detailKey}>{formatKey(key)}:</Text>
            <Text style={styles.detailValue}>{value}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Available Providers:</Text>
        {providerArray.length > 0 ? (
          providerArray.map((provider, index) => (
            <TouchableOpacity key={index} onPress={() => handleProviderClick(provider)} style={styles.providerItem}>
              <View>
                <Text
                  style={[styles.providerName, selectedProvider?.name === provider.name && styles.selectedProviderName]}
                >
                  {provider.name}
                </Text>
                <Text style={styles.providerContact}>{provider.phone}</Text>
                <Text style={styles.providerPrice}>Price: {provider.price} USD</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noProviders}>No providers available.</Text>
        )}

        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.payButton} onPress={handlePayNowClick}>
          <Text style={styles.buttonText}>Pay Now</Text>
        </TouchableOpacity>
      </Animated.View>

      {showPayment && (
        <Animated.View
          style={[
            styles.paymentContainer,
            {
              transform: [
                {
                  translateX: slideAnim.interpolate({
                    inputRange: [-width, 0],
                    outputRange: [0, width],
                  }),
                },
              ],
            },
          ]}
        >
          <PaymentComponent onClose={handleCompletePayment} onComplete={handleCompletePayment} />
        </Animated.View>
      )}
    </View>
  );
};

const formatKey = (key) => {
  return key.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  card: {
    backgroundColor: "#007BFF",
    padding: 20,
    margin: 5,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    position: "absolute",
    width: "100%",
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    color: "#e0e0e0",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    marginTop: 10,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  detailKey: {
    fontWeight: "bold",
    color: "#e0e0e0",
    marginRight: 10,
  },
  detailValue: {
    color: "#fff",
  },
  providerItem: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#0056b3",
  },
  providerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  selectedProviderName: {
    color: "#FFD700",
  },
  providerContact: {
    fontSize: 14,
    color: "#e0e0e0",
  },
  providerPrice: {
    fontSize: 14,
    color: "#e0e0e0",
  },
  noProviders: {
    fontSize: 14,
    color: "#e0e0e0",
    fontStyle: "italic",
  },
  backButton: {
    backgroundColor: "#004085",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  payButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  paymentContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
});

export default ServiceCard;
