import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

const ServiceSearch = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    } else {
      Alert.alert("Error", "Please enter a search query");
    }
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput style={styles.input} value={query} onChangeText={setQuery} placeholder="Search for services" />
      <Button title="Search" onPress={handleSearch} color="#28A745" />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 20,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
  },
});

export default ServiceSearch;
