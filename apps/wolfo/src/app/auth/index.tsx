import { Tab, TabView } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button } from "react-native";
import { Login } from "../../components/auth/login";
import { Register } from "../../components/auth/register";
const Auth = () => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const router = useRouter();
  return (
    <TabView selectedIndex={tabIndex} onSelect={setTabIndex}>
      <Tab title="Login">
        <Login />
      </Tab>
      <Tab title="Register">
        <Register />
      </Tab>
      <Button title="Go to chat" onPress={() => router.push("/chatroom")} />
    </TabView>
  );
};

export default Auth;
