import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, Button, Text, TouchableOpacity, View, Alert, Animated, Linking, Platform } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

import { useDispatch, useSelector } from "react-redux";
import { setServices, setServiceProviders, logout, setChoosenServices } from "../ReduxComonents/features/userSlice";
import Header from "../OtherComponents/HeaderComponent";
import ServiceSearch from "../OtherComponents/ServiceSearch";
import ServiceCard from "../components/ServiceCard";
import Modal from "react-native-modal";


const HomePage = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const chosenServices = useSelector((state) => state.user.services);
  const userData = useSelector((state) => state.user.userData);
  const [selectedService, setSelectedService] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0]; // Fade animation
  const [showSearch, setShowSearch] = useState(true); // State to toggle search and service card visibility
  const user = useSelector((state) => state.user.userData);
  const [bookedServices, setBookedServices] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const serviceList = Object.values(chosenServices || {});

 

  const handleSearch = async (query) => {
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
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate("Login");
  };

   const getBookings = async () => {
     if (isFetching) {
       return;
     }

     setIsFetching(true);
     const data = userData.email;
     console.log("Fetching bookings for:", data);

     try {
       const response = await axios.post("http://192.168.100.236:3000/getbookings", { data: data });

       if (response.status === 201) {
         setBookedServices(response.data.Object);
         console.log(response.data.Object);
       } else {
         console.log(response.data.error || response.status);
       }
     } catch (error) {
       console.log(error);
     } finally {
       setIsFetching(false);
     }
   };

      useEffect(() => {
             getBookings();

        if (!userData) return; // Wait for user data to load
        if (!chosenServices) return; // Wait for services to load
      }, [userData, chosenServices]);
    
  const handleServiceClick = async (service) => {
    try {
      console.log("Service clicked:", service); // Log the entire service object
      dispatch(setChoosenServices(service));
      setSelectedService(service); // Set selected service
      setShowSearch(false); // Hide the search bar and results

      const combined = service.combined_key;
      const response = await axios.post("http://192.168.100.236:3000/providers", { combined_key: combined });
      if (response.status === 200) {
        console.log("Success retrieval of Service Providers");
        console.log(response.data || "service provider retrieval failed");
        dispatch(setServiceProviders(response.data));
      }
      console.log("Error", response.error);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Error handling service click", error);
    }
  };

  const handleItemPress = (item) => {
    setSelectedService(item);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedService(null);
  };

  const handleViewLocation = () => {
    setIsModalVisible(false);
    setIsLocationModalVisible(true);
  };


  const handleBackToSearch = () => {
    setSelectedService(null); // Clear selected service
    setShowSearch(true); // Show the search bar and results
  };



    const renderItem = ({ item }) => (
      <TouchableOpacity style={styles.item} onPress={() => handleItemPress(item)}>
        <Text style={styles.bold}>Service: {item.service_name}</Text>
        <Text style={styles.bold}>Payment Status: {item.payment_status}</Text>
        <Text style={styles.k}>Task Status: {item.booking_status}</Text>
      </TouchableOpacity>
    );
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View>
          <View style={styles.header}>
            <Text style={styles.headerText}>Welcome, {user.name}!</Text>
            <Button title="Logout" onPress={handleLogout} color="#FF6347" />
          </View>{}
          <Text style={styles.headerText}>Booked Services</Text>

      {bookedServices.length ? (
        <FlatList
          data={bookedServices}
          renderItem={renderItem}
          keyExtractor={(item) => item.booking_id.toString()}
          ListEmptyComponent={<Text style={styles.noResultsText}>No services found.</Text>}
        />
      ) : (
        <Text>No services booked yet.</Text>
      )}

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={handleCloseModal}
        onBackButtonPress={handleCloseModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={styles.modal}
      >
        <View style={styles.snazzyModal}>
          <View style={styles.titleContainer}>
            <Text style={styles.funkyTitle}>We made it</Text>
          </View>
          {selectedService && (
            <>
              <View style={styles.detailContainer}>
                <Text style={styles.detailLabel}>Service Name:</Text>
                <Text style={styles.detailValue}>{selectedService.service_name}</Text>
              </View>
              <View style={styles.detailContainer}>
                <Text style={styles.detailLabel}>Payment Status:</Text>
                <Text style={styles.detailValue}>{selectedService.payment_status}</Text>
              </View>
              <View style={styles.detailContainer}>
                <Text style={styles.detailLabel}>Task Status:</Text>
                <Text style={styles.detailValue}>{selectedService.booking_status}</Text>
              </View>
              <View style={styles.detailContainer}>
                <Text style={styles.detailLabel}>Customer Name:</Text>
                <Text style={styles.detailValue}>{selectedService.name}</Text>
              </View>
              <View style={styles.detailContainer}>
                <Text style={styles.detailLabel}>Customer Number:</Text>
                <Text style={styles.detailValue}>{selectedService.phone}</Text>
              </View>
              <View style={styles.detailContainer}>
                <Text style={styles.detailLabel}>Location:</Text>
                <Text style={styles.detailValue}>{selectedService.address}</Text>
              </View>
            </>
          )}
          <View style={styles.fancyButtonRow}>
            <TouchableOpacity style={styles.locationButton} onPress={handleViewLocation}>
              <Text style={styles.buttonText}>View Location</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        isVisible={isLocationModalVisible}
        onBackdropPress={() => setIsLocationModalVisible(false)}
        onBackButtonPress={() => setIsLocationModalVisible(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={styles.modal}
      ></Modal>
          {showSearch && <ServiceSearch onSearch={handleSearch} />}
        </View>

        {selectedService ? (
          <ServiceCard service={selectedService} onBack={handleBackToSearch} />
        ) : (
          <FlatList
            data={serviceList}
            renderItem={({ item }) => {
              const backgroundColor =
                selectedService && item.service_id === selectedService.service_id ? "#6e3b6e" : "#f9c2ff";
              const color = selectedService && item.service_id === selectedService.service_id ? "white" : "black";

              return (
                <TouchableOpacity onPress={() => handleServiceClick(item)} style={[styles.item, { backgroundColor }]}>
                  <Text style={[styles.title, { color }]}>{item.service_name}</Text>
                  <Text style={styles.description}>{item.service_description}</Text>
                </TouchableOpacity>
              );
            }}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#007BFF",
  },
  headerText: {
    color: "white",
    fontSize: 20,
  },
  container_new: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
  },
  logoutButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  item_new: {
    backgroundColor: "#e3f2fd",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bbdefb",
  },
  bold: {
    fontWeight: "bold",

    marginBottom: 5,
  },
  k: {
    marginTop: 5,
    color: "#555",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 20,
    alignItems: "flex-start",
    flex: 1,
    justifyContent: "center",
  },
  modalText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#007bff",
  },
  modalDetail: {
    fontSize: 18,
    marginBottom: 10,
    color: "#555",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  locationButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },

  snazzyModal: {
    backgroundColor: "#f0f8ff",
    padding: 20,
    borderRadius: 15,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    margin: 10,
  },
  titleContainer: {
    backgroundColor: "#6a5acd",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  funkyTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  detailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#eef2f3",
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dcdcdc",
  },
  detailLabel: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#2f4f4f",
  },
  detailValue: {
    fontSize: 16,
    color: "#696969",
  },
  fancyButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  sharedButton: {
    backgroundColor: "#4682b4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default HomePage;
