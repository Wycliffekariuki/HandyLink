import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../ReduxComonents/features/userSlice";
import { useNavigation } from "@react-navigation/native";

const Header = (handleLogout) => {
  const dispatch = useDispatch();
  const isLogedIn = useSelector((state) => state.user.isLogedIn);
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.userData);

  if (!isLogedIn) {
    navigation.navigate("Login");
    return;
  }
  
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>Welcome, {user.name}!</Text>
      <Button title="Logout" onPress={handleLogout} color="#FF6347" />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default Header;
