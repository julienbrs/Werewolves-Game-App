import { Text, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { Tab, Input, TabView } from "@rneui/themed";
import { useState } from "react";
import Register from "./register";
import Login from "./login";

const Auth = () => {
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState<number>(0);
  return (
    <>
      <Tab value={tabIndex} onChange={setTabIndex}>
        <Tab.Item title="Login" />
        <Tab.Item title="Register" />
      </Tab>
      <TabView value={tabIndex} onChange={setTabIndex}>
        <TabView.Item style={{ width: "100%" }}>
          <Login />
        </TabView.Item>
        <TabView.Item style={{ width: "100%" }}>
          <Register />
        </TabView.Item>
      </TabView>
    </>
  );
};

export default Auth;
