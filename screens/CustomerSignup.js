import React, { useState, useEffect } from "react";
import { View, Button, Text, StyleSheet, Alert } from "react-native";
import CheckboxPopup from "../OtherComponents/ServiceCheckbox";
import PricePopup from "../OtherComponents/PricePopup";
import { useDispatch } from "react-redux";
import store from "../ReduxComonents/app/store";
import { setChoosenServices } from "../ReduxComonents/features/userSlice";
import ImageSubmission from "../OtherComponents/ImageSubmission";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const CustomerSignup = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isPricePopupVisible, setIsPricePopupVisible] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [prices, setPrices] = useState({});
  const [imagePath, setImagePath] = useState("");
  const [options, setOptions] = useState([]);
  const isServiceProvider = store.getState().user.userType === "service_provider";

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.post("http://192.168.100.236:3000/getallservices");
        if (response.status === 200) {
          setOptions(response.data);
        } else {
          console.log(response.data.error);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchServices();
  }, []);

  const handlePopupClose = (chosenOptions) => {
    setIsPopupVisible(false);
    setSelectedOptions(chosenOptions);
    setIsPricePopupVisible(true); // Open the price popup after selecting services
    try {
      dispatch(setChoosenServices(chosenOptions));
      console.log(store.getState().user.choosenServices);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePricePopupClose = (prices) => {
    setIsPricePopupVisible(false);
    setPrices(prices);
  };

  const handleImageSaved = (path) => {
    setImagePath(path);
  };

  const canCompleteRegistration = () => {
    if (isServiceProvider) {
      return Object.keys(selectedOptions).length > 0 && Object.keys(prices).length > 0 && imagePath;
    } else {
      return Object.keys(selectedOptions).length > 0;
    }
  };

  const completeRegistration = async () => {
    try {
      const userType = store.getState().user.userType;
      const userData = store.getState().user.userData;
      const objExt = [imagePath, userType];
      const selectedLabels = options.filter((option) => selectedOptions[option.service_name]);
      const data = { selectedLabels, prices, userData, objExt };

      console.log("Data to be sent:", data); // Log the data being sent

      const response = await axios.post("http://192.168.100.236:3000/Insert", data);
      if (response.status === 201) {
        navigation.navigate("Login");
      } else if (response.status === 500) {
        Alert.alert("Won't be the first time", response.data.error, response.data.data);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Open Checkbox Popup" onPress={() => setIsPopupVisible(true)} />
      <CheckboxPopup isVisible={isPopupVisible} options={options} onClose={handlePopupClose} />

      {isServiceProvider && (
        <>
          <PricePopup
            isVisible={isPricePopupVisible}
            selectedServices={Object.keys(selectedOptions).filter((key) => selectedOptions[key])}
            onClose={handlePricePopupClose}
          />
          <ImageSubmission onImageSaved={handleImageSaved} />
        </>
      )}
      <View style={styles.selectedOptionsContainer}>
        <Text style={styles.selectedOptionsTitle}>Selected Options:</Text>
        {Object.entries(selectedOptions).map(([key, value]) =>
          value ? <Text key={key}>{`${key}: ${prices[key] || "No price set"}`}</Text> : null,
        )}
        {canCompleteRegistration() && <Button title="Complete Registration" onPress={completeRegistration} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 16,
    height: "60%",
  },
  selectedOptionsContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  selectedOptionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomerSignup;
