import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Alert, Animated } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setServices, setServiceProviders, logout, setChoosenServices } from "../ReduxComonents/features/userSlice";
import Header from "../OtherComponents/HeaderComponent"; // Import your Header component
import ServiceSearch from "../OtherComponents/ServiceSearch";
import ServiceCard from "../components/ServiceCard";

const HomePage = () => {
  const dispatch = useDispatch();
  const chosenServices = useSelector((state) => state.user.services);
  const [selectedService, setSelectedService] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0]; // Fade animation
  const [showSearch, setShowSearch] = useState(true); // State to toggle search and service card visibility
  const [isRequestInProgress, setIsRequestInProgress] = useState(false); // New state to track request status

  const serviceList = Object.values(chosenServices || {});

  const handleSearch = async (query) => {
    if (isRequestInProgress) {
      return; // Prevent if a request is already in progress
    }

    setIsRequestInProgress(true); // Set state to indicate the request is in progress
    try {
      const response = await axios.post("http://192.168.100.236:3000/search", { userQuery: query });
      if (response.status === 200 && response.data) {
        dispatch(setServices(response.data));
      } else {
        Alert.alert("Error", response.data.error || "Invalid data format received");
      }
    } catch (error) {
      console.error("Search Error:", error);
      Alert.alert("Error", error.message || "Unable to fetch data");
    } finally {
      setIsRequestInProgress(false); // Reset the state once the request is completed
    }
  };

  const handleServiceClick = async (service) => {
    if (isRequestInProgress) {
      return; // Prevent multiple requests when a request is in progress
    }

    setIsRequestInProgress(true); // Indicate that a request is in progress
    try {
      console.log("Service clicked:", service); // Log the entire service object
      dispatch(setChoosenServices(service));
      setSelectedService(service); // Set selected service
      setShowSearch(false); // Hide the search bar and results
      const combined = service.combined_key;
      const response = await axios.post("http://192.168.100.236:3000/providers", { combined_key: combined });
      if (response.status === 200) {
        console.log("Success retrieval of Service Providers");
        console.log(response.data);
        dispatch(setServiceProviders(response.data));
      }
      console.log("Error", response.error);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Error fetching service providers", error);
    } finally {
      setIsRequestInProgress(false); // Reset the state once the request is completed
    }
  };

  const handleBackToSearch = () => {
    setSelectedService(null); // Clear selected service
    setShowSearch(true); // Show the search bar and results
  };

  const renderHeader = () => (
    <View>
      <Header /> {/* Include your Header component here */}
      {showSearch && <ServiceSearch onSearch={handleSearch} />}
    </View>
  );

  const renderItem = ({ item }) => {
    console.log("Rendering item:", item); // Log to ensure the item is being passed correctly

    const backgroundColor = selectedService && item.service_id === selectedService.service_id ? "#6e3b6e" : "#f9c2ff";
    const color = selectedService && item.service_id === selectedService.service_id ? "white" : "black";

    return (
      <TouchableOpacity
        onPress={() => {
          console.log("Service clicked:", item); // Log here to ensure this event is triggered
          handleServiceClick(item);
        }}
        style={[styles.item, { backgroundColor }]}
      >
        <Text style={[styles.title, { color }]}>{item.service_name}</Text>
        <Text style={styles.description}>{item.service_description}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        {selectedService ? (
          <ServiceCard service={selectedService} onBack={handleBackToSearch} />
        ) : (
          <FlatList
            data={serviceList}
            renderItem={renderItem}
            keyExtractor={(item) => item.combined_key}
            ListEmptyComponent={<Text style={styles.noResultsText}>No services found.</Text>}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#f9c2ff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "gray",
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    color: "gray",
    fontSize: 16,
  },
});

export default HomePage;
