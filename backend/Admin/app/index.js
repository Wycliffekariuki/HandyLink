import React from "react";
import { NavigationContainer  } from "@react-navigation/native";
import { createNativeStackNavigator, NavigationIndependentTree } from "@react-navigation/native-stack";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// Import your components
import UserTable from "../admincomponents/UserTable";
import ServiceTable from "../admincomponents/ServiceTable";
import ServiceBookingTable from "../admincomponents/ServiceBooking";
import TransactionTable from "../admincomponents/TransactionTable";

// Create the Stack Navigator
const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Manage Users")}>
        <Text style={styles.buttonText}>Manage Users</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Manage Services")}>
        <Text style={styles.buttonText}>Manage Services</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Manage Bookings")}>
        <Text style={styles.buttonText}>Manage Bookings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Manage Transactions")}>
        <Text style={styles.buttonText}>Manage Transactions</Text>
      </TouchableOpacity>
    </View>
  );
};

const App = () => {
  return (
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Manage Users" component={UserTable} />
        <Stack.Screen name="Manage Services" component={ServiceTable} />
        <Stack.Screen name="Manage Bookings" component={ServiceBookingTable} />
        <Stack.Screen name="Manage Transactions" component={TransactionTable} />
      </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default App;
