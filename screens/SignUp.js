import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { StatusBar, Alert, View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import * as Location from "expo-location";
import { Formik } from "formik";
import { Octicons, Ionicons, Zocial } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import store from "../ReduxComonents/app/store"; // import your Redux store
import { setUserData } from "../ReduxComonents/features/userSlice";
import {
  StyledContainer,
  InnerContainer,
  SubTitle,
  StyledFormArea,
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  RightIcon,
  StyledButton,
  ButtonText,
  MessageBox,
  Line,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent,
  Colors,
} from "./../components/styles";

const { brand, darkLight } = Colors;

const Signup = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userType = useSelector((state) => state.user.userType); // Access user type
  const [hidePassword, setHidePassword] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [dob, setDob] = useState();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const handleLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Location permission is required to get your current location.");
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setDob(currentDate);
  };

  const handleFormSubmit = async (values) => {
    const data = {
      ...values,
      dateOfBirth: dob ? dob.toISOString().split("T")[0] : "",
      latitude,
      longitude,
    };

    try {
      const response = await axios.post("http://192.168.100.236:3000/signup", data);

      if (response.status === 201) {
        dispatch(setUserData(data));
        if (userType === "customer") {
          navigation.navigate("CustomerSignup");
         // console.log(store.getState().user.userData);
        } else if (userType === "service_provider") {
          navigation.navigate("ServiceProviderSignup");
         // console.log(store.getState().user.userData);
        }
      }

      if (response.status === 400) {
        return Alert.alert("You missed something", response.data.message);
      }
    } catch (error) {
      if (error.response) {
        console.log(`Server responded with ${error.response.status}: ${error.response.data.error}`);
        Alert.alert("Error", error.response.data.error || "Signup Failed");
      } else if (error.request) {
        console.log("Error: No response received from the server.");
        Alert.alert("Error", "Network error. Please try again later.");
      } else {
        console.log("Error:", error.message);
        Alert.alert("Error", error.message || "An unexpected error occurred.");
      }
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "android" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView>
        <StyledContainer>
          <StatusBar style="dark" />
          <InnerContainer>
            <SubTitle>Account Signup</SubTitle>

            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={handleDateChange}
              />
            )}

            <Formik
              initialValues={{
                fullName: "",
                phoneNumber: "",
                email: "",
                dateOfBirth: "",
                password: "",
                confirmPassword: "",
                address: "",
              }}
              onSubmit={handleFormSubmit}
            >
              {({ handleChange, handleBlur, handleSubmit, values }) => (
                <StyledFormArea>
                  <MyTextInput
                    label="Full Name"
                    icon="person"
                    placeholder="John Kimani"
                    placeholderTextColor={darkLight}
                    onChangeText={handleChange("fullName")}
                    onBlur={handleBlur("fullName")}
                    value={values.fullName}
                  />
                  <MyTextInput
                    label="Phone Number"
                    icon2="call"
                    placeholder="0700000000"
                    placeholderTextColor={darkLight}
                    onChangeText={handleChange("phoneNumber")}
                    onBlur={handleBlur("phoneNumber")}
                    value={values.phoneNumber}
                  />
                  <MyTextInput
                    label="Email Address"
                    icon="mail"
                    placeholder="example@gmail.com"
                    placeholderTextColor={darkLight}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    keyboardType="email-address"
                  />
                  <MyTextInput
                    label="Date of Birth"
                    icon="calendar"
                    placeholder="YYYY - MM - DD"
                    placeholderTextColor={darkLight}
                    value={dob ? dob.toDateString() : ""}
                    isDate={true}
                    editable={false}
                    showDatePicker={() => setShowDatePicker(true)}
                  />
                  <MyTextInput
                    label="Password"
                    icon="lock"
                    placeholder="* * * * * * * *"
                    placeholderTextColor={darkLight}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    secureTextEntry={hidePassword}
                    isPassword={true}
                    hidePassword={hidePassword}
                    setHidePassword={setHidePassword}
                  />
                  <MyTextInput
                    label="Confirm Password"
                    icon="lock"
                    placeholder="* * * * * * * *"
                    placeholderTextColor={darkLight}
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    value={values.confirmPassword}
                    secureTextEntry={hidePassword}
                    isPassword={true}
                    hidePassword={hidePassword}
                    setHidePassword={setHidePassword}
                  />
                  <MyTextInput
                    label="Address"
                    icon="location"
                    placeholder="Address"
                    placeholderTextColor={darkLight}
                    onChangeText={handleChange("address")}
                    onBlur={handleBlur("address")}
                    value={values.address}
                  />
                  <StyledButton onPress={handleLocation}>
                    <ButtonText>Get Location</ButtonText>
                  </StyledButton>
                  {latitude && longitude && <ExtraText>{`Latitude: ${latitude}, Longitude: ${longitude}`}</ExtraText>}
                  <StyledButton onPress={handleSubmit}>
                    <ButtonText>Sign Up</ButtonText>
                  </StyledButton>
                  <Line />
                  <ExtraView>
                    <ExtraText>Already have an account?</ExtraText>
                    <TextLink>
                      <TextLinkContent>Login</TextLinkContent>
                    </TextLink>
                  </ExtraView>
                </StyledFormArea>
              )}
            </Formik>
          </InnerContainer>
        </StyledContainer>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Text Input Component for Reusability
const MyTextInput = ({
  label,
  icon,
  icon2,
  isPassword,
  hidePassword,
  setHidePassword,
  isDate,
  showDatePicker,
  ...props
}) => (
  <View>
    <LeftIcon>
      {icon && <Octicons name={icon} size={30} color={brand} />}
      {icon2 && <Zocial name={icon2} size={24} color={brand} />}
    </LeftIcon>
    <StyledInputLabel>{label}</StyledInputLabel>
    {isDate ? (
      <TouchableOpacity onPress={showDatePicker}>
        <StyledTextInput {...props} editable={false} />
      </TouchableOpacity>
    ) : (
      <StyledTextInput {...props} />
    )}
    {isPassword && (
      <RightIcon onPress={() => setHidePassword(!hidePassword)}>
        <Ionicons name={hidePassword ? "eye-off" : "eye"} size={30} color={darkLight} />
      </RightIcon>
    )}
  </View>
);

export default Signup;
