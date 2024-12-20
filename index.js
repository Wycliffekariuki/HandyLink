import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";



// Screens
import Login from "./screens/Login";
import Signup from "./screens/SignUp";
import Welcome from "./screens/Welcome";
import CustomerSignup from "./screens/CustomerSignup";
import ServiceProviderSignup from "./screens/ServiceProviderSignup";
import HomePage from "./screens/Home";
import ServiceProviderHome from "./screens/ServiceProviderHome";

const Stack = createStackNavigator();

export default function Index() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="CustomerSignup" component={CustomerSignup} />
        <Stack.Screen name="ServiceProviderSignup" component={ServiceProviderSignup} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="ServiceProviderHome" component={ServiceProviderHome} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}




