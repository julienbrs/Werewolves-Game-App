import { Tab, TabView } from "@rneui/themed";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Login } from "./login";
import { Register } from "./register";

const Auth = () => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  return (
    <>
      <Tab value={tabIndex} onChange={setTabIndex}>
        <Tab.Item title="Login" />
        <Tab.Item title="Register" />
      </Tab>
      <TabView value={tabIndex} onChange={setTabIndex}>
        <TabView.Item style={styles.tabview}>
          <Login />
        </TabView.Item>
        <TabView.Item style={styles.tabview}>
          <Register />
        </TabView.Item>
      </TabView>
    </>
  );
};
const styles = StyleSheet.create({
  tabview: {
    width: "100%",
  },
});

export default Auth;
