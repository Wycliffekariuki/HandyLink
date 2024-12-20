import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Animated , Linking,Platform, Alert} from "react-native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../ReduxComonents/features/userSlice";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from "react-native-modal";

const ServiceProviderHome = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userData = useSelector((state) => state.user.userData);

  const [bookedServices, setBookedServices] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const colorAnim = useState(new Animated.Value(0))[0];

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
    Animated.loop(
      Animated.sequence([
        Animated.timing(colorAnim, { toValue: 1, duration: 2000, useNativeDriver: false }),
        Animated.timing(colorAnim, { toValue: 0, duration: 2000, useNativeDriver: false }),
      ]),
    ).start();
  }, []);

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

  const handleProceed = () => {
    // Add functionality to open Google Maps or other actions
    try {
        const latitude = selectedService.latitude; // latitude of your desire location
        const longitude = selectedService.longitude; // longitude of your desire location
        const scheme = Platform.select({
          ios: "maps:0,0?q=", // if device is ios
          android: "geo:0,0?q=", // if device is android
        });
        const latLng = `${latitude},${longitude}`;
        const label = "Your Client";
        const url = Platform.select({
          ios: `${scheme}${label}@${latLng}`,
          android: `${scheme}${latLng}(${label})`,
        });

        Linking.openURL(url);
        
    } catch (error) {
        
    }
    
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleItemPress(item)}>
      <Text style={styles.bold}>Service: {item.service_name}</Text>
      <Text style={styles.bold}>Payment Status: {item.payment_status}</Text>
      <Text style={styles.k}>Task Status: {item.booking_status}</Text>
    </TouchableOpacity>
  );

  const interpolatedBackgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#ff6b6b", "#1dd1a1"],
  });

  const interpolatedTextColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#1dd1a1", "#ff6b6b"],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Animated.View style={[styles.welcomeContainer, { backgroundColor: interpolatedBackgroundColor }]}>
          <Animated.Text style={[styles.welcomeText, { color: interpolatedTextColor }]}>
            Welcome, {userData.name}
          </Animated.Text>
        </Animated.View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

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
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>You are about to open GoogleMaps</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.sharedButton} onPress={() => setIsLocationModalVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sharedButton} onPress={handleProceed}>
              <Text style={styles.buttonText}>Proceed</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
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
  item: {
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

export default ServiceProviderHome;
