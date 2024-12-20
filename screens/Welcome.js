import React from "react";
import { useDispatch } from "react-redux";
import { setUserType } from "../ReduxComonents/features/userSlice";
import { useNavigation } from "@react-navigation/native";
import { View, Text, Button, Alert, StyleSheet } from "react-native";

const WelcomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleNavigation = (type) => {
    try {
      dispatch(setUserType(type)); // Save user type to Redux
      console.log("Hook successful");
      navigation.navigate("Signup"); // Navigate to the Signup page
      console.log("Navigation successful");

    } catch (error) {
      Alert.alert("Error", "Failed to navigate. Please try again."); // Show error
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Button title="I'm a Customer" onPress={() => handleNavigation("customer")} />
      <Button title="I'm a Service Provider" onPress={() => handleNavigation("service_provider")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});

export default WelcomeScreen;
