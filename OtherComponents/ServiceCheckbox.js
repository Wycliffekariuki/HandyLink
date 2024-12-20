import React, { useState, useEffect } from "react";
import { View, Button, StyleSheet, ScrollView } from "react-native";
import Modal from "react-native-modal";
import { Checkbox, Text, Portal, Provider } from "react-native-paper";

const CheckboxPopup = ({ isVisible, options = [], onClose }) => {
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    if (isVisible) {
      setSelectedOptions({});
    }
  }, [isVisible]);

  const handleCheckboxChange = (option) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [option.service_name]: !prevState[option.service_name],
    }));
  };

  const handleClose = () => {
    onClose(selectedOptions);
  };

  return (
    <Provider>
      <Portal>
        <Modal isVisible={isVisible}>
          <View style={styles.container}>
            <Text style={styles.title}>Select Options</Text>
            <ScrollView>
              {options.map((option, index) => (
                <View key={index} style={styles.checkboxContainer}>
                  <Checkbox
                    status={selectedOptions[option.service_name] ? "checked" : "unchecked"}
                    onPress={() => handleCheckboxChange(option)}
                  />
                  <Text style={styles.checkboxLabel}>{option.service_name}</Text>
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
  container: { backgroundColor: "white", padding: 20, borderRadius: 10 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  scrollView: { marginBottom: 10 },
  checkboxContainer: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  checkboxLabel: { marginLeft: 8 },
  button: { marginTop: 10 },
});

export default CheckboxPopup;
