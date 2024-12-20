import React from "react";
import { Provider } from "react-redux";
import Index from "./index";
import store from "./ReduxComonents/app/store"; // import your Redux store

const App = () => (
  <Provider store={store}>
    <Index />
  </Provider>
);

//registerRootComponent(ReduxApp);

export default App;
/*
const AppWrapper = () => (
    <StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
  </StrictMode>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppWrapper />);

*/
