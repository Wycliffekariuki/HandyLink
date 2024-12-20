import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userType: null, // "customer" or "service_provider"
  userData: {}, // Temporary storage for user data
  choosenServices: {},  // Temporary storage for choosen services
  isLoggedIn: false, // Login status
  profileImageUrl: null,
  services: {},
  serviceProviders: [],
  choosenServiceProvider: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserType: (state, action) => {
      state.userType = action.payload; // Set the type of user
    },
    setprofileImageUrl: (state, action) => {
      state.profileImageUrl = action.payload; // Set the type of user
    },
    setUserData: (state, action) => {
      state.userData = { ...state.userData, ...action.payload }; // Update user data
    },
    setServices: (state, action) => {
      state.services = { ...state.services, ...action.payload };
    },
    setChoosenServices: (state, action) => {
      state.choosenServices = { ...state.choosenServices, ...action.payload }; // Update choosen services data
    },
    
    setServiceProviders: (state, action) => {
      state.serviceProviders = { ...state.serviceProviders, ...action.payload };
    },
    setchoosenServiceProvider: (state, action) => {
      state.choosenServiceProvider = { ...state.choosenServiceProvider, ...action.payload };
    },
    login: (state) => {
      state.isLoggedIn = true; // Set login status
    },
    logout: (state) => {
      state.isLoggedIn = false; // Reset login status
      state.userType = null; // Clear user type
      state.userData = {}; // Clear user data
      state.choosenServices = {};
      state.services = {};
    },
  },
});

export const { setUserType, setUserData, login, logout, setChoosenServices, setprofileImageUrl, setServices, setServiceProviders , setchoosenServiceProvider} = userSlice.actions;
export default userSlice.reducer;
