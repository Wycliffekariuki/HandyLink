import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";

const HalfTable = ({ labels, data, handleAddData,handleLoadRow }) => {
  const [inputValues, setInputValues] = useState([]);
  const [staticInputValue, setStaticInputValue] = useState(""); // State for static input

  useEffect(() => {
    // Initialize the input values with the current data, ensuring they are strings
    setInputValues(data.map((item) => String(item) || ""));
  }, [data]);

  const handleInputChange = (index, value) => {
    const updatedValues = [...inputValues];
    updatedValues[index] = value;
    setInputValues(updatedValues);
  };

  const onSubmit = () => {
    if (handleAddData) {
      handleAddData(inputValues); // Pass the input values to the handler
    }
  };

  const handleStaticInputChange = (value) => {
    setStaticInputValue(value); // Update the static input value
  };

  

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView horizontal style={styles.scrollContainer}>
        <View style={styles.tableContainer}>
          {/* Header Row */}
          <View style={styles.row}>
            {labels.map((label, index) => (
              <View key={`header-${index}`} style={styles.cell}>
                <Text style={styles.headerText}>{label}</Text>
              </View>
            ))}
          </View>

          {/* Data Row */}
          <View style={styles.row}>
            {data.map((value, index) => (
              <View key={`data-${index}`} style={styles.cell}>
                <Text style={styles.dataText}>{String(value)}</Text>
              </View>
            ))}
          </View>

          {/* Input Row */}
          <View style={styles.row}>
            {labels.map((label, index) => (
              <View key={`input-${index}`} style={styles.cell}>
                <Text style={styles.inputLabel}>{label}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={`Enter ${label}`}
                  value={inputValues[index] || ""}
                  onChangeText={(text) => handleInputChange(index, text)}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Static Input and Button for Loading Row */}
      <View style={styles.staticInputContainer}>
        <TextInput
          style={styles.staticInput}
          placeholder="Static input"
          value={staticInputValue}
          onChangeText={handleStaticInputChange}
        />
        <Button title="Load a Row" onPress={handleLoadRow} />
      </View>

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <Button title="Submit" onPress={onSubmit} style={styles.submitButton} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start", // Start at the top
    alignItems: "center",
    padding: 10,
  },
  scrollContainer: {
    width: "100%",
  },
  tableContainer: {
    width: "auto",
    paddingHorizontal: 5,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 4,
    minWidth: 250, // Make the cells smaller for compact design
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  headerText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
  },
  dataText: {
    color: "#333",
    textAlign: "center",
    fontSize: 12,
  },
  inputLabel: {
    textAlign: "center",
    marginBottom: 5,
    fontWeight: "bold",
    fontSize: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 6,
    width: "90%",
    fontSize: 12,
    alignSelf: "center",
  },
  staticInputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    width: "100%",
    paddingHorizontal: 20,
  },
  staticInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 6,
    width: "80%",
    fontSize: 12,
    marginRight: 10,
  },
  buttonContainer: {
    marginTop: 10,
    width: "100%",
    paddingHorizontal: 20,
  },
  submitButton: {
    width: "50%",
    margin: 10,
  },
});

export default HalfTable;
