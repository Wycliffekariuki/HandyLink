import React, { useState } from "react";
import { View, Button, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import Modal from "react-native-modal";
import { Portal, Provider } from "react-native-paper";

const PricePopup = (props) => {
  const { isVisible, selectedServices = [], onClose } = props;
  const [prices, setPrices] = useState({});

  const handlePriceChange = (value, service) => {
    setPrices((prevState) => ({
      ...prevState,
      [service]: value,
    }));
  };

  const handleClose = () => {
    onClose(prices);
  };

  return (
    <Provider>
      <Portal>
        <Modal isVisible={isVisible} onBackdropPress={handleClose}>
          <View style={styles.container}>
            <Text style={styles.title}>Set Prices for Selected Services</Text>
            <ScrollView>
              {selectedServices.map((service, index) => (
                <View key={index} style={styles.serviceContainer}>
                  <Text style={styles.serviceLabel}>{service}</Text>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="Set Price"
                    keyboardType="numeric"
                    value={prices[service] || ""}
                    onChangeText={(value) => handlePriceChange(value, service)}
                  />
                </View>
              ))}
            </ScrollView>
            <Button title="Close" onPress={handleClose} />
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  serviceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  serviceLabel: {
    marginLeft: 8,
    flex: 1,
  },
  priceInput: {
    marginLeft: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    flex: 1,
  },
});

export default PricePopup;
