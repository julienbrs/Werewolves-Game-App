import { Tab, TabView } from "@ui-kitten/components";
import React, { useState } from "react";
import { Login } from "./login";
import { Register } from "./register";
const Auth = () => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  return (
    <TabView selectedIndex={tabIndex} onSelect={setTabIndex}>
      <Tab title="Login">
        <Login />
      </Tab>
      <Tab title="Register">
        <Register />
      </Tab>
    </TabView>
  );
};

export default Auth;
