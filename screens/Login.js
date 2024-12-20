import React, { useState, useEffect } from "react";
import { StatusBar, Alert, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import axios from "axios";
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { login, setUserData, setUserType, setChoosenServices } from "../ReduxComonents/features/userSlice";
import { useNavigation } from "@react-navigation/native";
import store from "../ReduxComonents/app/store";
import {
  StyledContainer,
  InnerContainer,
  PageLogo,
  PageTitle,
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
import { KeyboardAvoidingView, View, ScrollView, Platform } from "react-native";
const { brand, darkLight, primary } = Colors;

const Login = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const isLoggedIn = store.getState().user.isLoggedIn;
    const userType = store.getState().user.userType;

    if (isLoggedIn) {
      navigation.navigate(userType === "service_provider" ? "ServiceProviderHome" : "HomePage");
    }
  }, []);
  const handleSignup = () => {
    navigation.navigate("Welcome");

  }
  

  const handleLogin = async (values, actions) => {
    try {
      const isLoggedIn = store.getState().user.isLoggedIn;
      const userType = store.getState().user.userType;

      if (isLoggedIn) {
        navigation.navigate(userType === "service_provider" ? "ServiceProviderHome" : "HomePage");
      }
      const response = await axios.post("http://192.168.100.236:3000/Login", values);

      if (response.status === 201) {
        const { strings, objects } = response.data;
        const { user_type, ...userData } = strings;

        const userType = user_type === "ServiceProvider" ? "service_provider" : "customer";

        dispatch(login());
        dispatch(setUserType(userType));
        dispatch(setUserData(userData));
        dispatch(setChoosenServices(objects.details));

        navigation.navigate(userType === "service_provider" ? "ServiceProviderHome" : "HomePage");
      } else {
        Alert.alert("Error", response.data.error || "Something went wrong.");
      }
    } catch (error) {
      if (error.response) {
        Alert.alert("Server Error", error.response.data.error || "Unexpected server error.");
      } else {
        Alert.alert("Network Error", "Please check your internet connection.");
      }
      console.error(error);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "android" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView>
        <StyledContainer>
          <View style={{ padding: 15 }}>
            <StatusBar style="light-content" backgroundColor="#fff" barStyle="light-content" />
          </View>
          <InnerContainer>
            <PageLogo resizeMode="cover" source={require("./../assets/img/img1.jpg")} />
            <PageTitle>HandyLink</PageTitle>
            <SubTitle>Account Login</SubTitle>
            <Formik
              initialValues={{ email: "", password: "" }}
              onSubmit={(values, actions) => {
                actions.setSubmitting(true);
                handleLogin(values, actions);
              }}
            >
              {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
                <StyledFormArea>
                  <MyTextInput
                    label="Email Address"
                    icon="mail"
                    placeholder="andyj@gmail.com"
                    placeholderTextColor={darkLight}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    keyboardType="email-address"
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
                  <MessageBox>...</MessageBox>
                  <StyledButton onPress={handleSubmit} disabled={isSubmitting}>
                    <ButtonText>{isSubmitting ? "Logging In..." : "Login"}</ButtonText>
                  </StyledButton>
                  <Line />
                  <StyledButton google={true}>
                    <Fontisto name="google" color={primary} size={25} />
                    <ButtonText google={true}>Sign in with Google</ButtonText>
                  </StyledButton>
                  <ExtraView>
                    <ExtraText>Don't have an account already? </ExtraText>
                      <TextLink onPress={handleSignup}>
                        <TextLinkContent>Signup</TextLinkContent>
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

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => (
  <View>
    <LeftIcon>
      <Octicons name={icon} size={30} color={brand} />
    </LeftIcon>
    <StyledInputLabel>{label}</StyledInputLabel>
    <StyledTextInput {...props} />
    {isPassword && (
      <RightIcon onPress={() => setHidePassword(!hidePassword)}>
        <Ionicons name={hidePassword ? "eye-off" : "eye"} size={30} color={darkLight} />
      </RightIcon>
    )}
  </View>
);

export default Login;
