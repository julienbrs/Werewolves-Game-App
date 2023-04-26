import { Tab, TabView } from "@ui-kitten/components";
import React, { useState } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import imgBackground from "../../../assets/homepage_day.png";
import { Login } from "../../components/auth/login";
import { Register } from "../../components/auth/register";

const Auth = () => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  return (
    <View style={styles.container}>
      <ImageBackground source={imgBackground} style={styles.image}>
        <View style={styles.tabViewWrapper}>
          <TabView selectedIndex={tabIndex} onSelect={setTabIndex} style={styles.tabView}>
            <Tab title="Login">
              <Login />
            </Tab>
            <Tab title="Register">
              <Register />
            </Tab>
          </TabView>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    overflow: "hidden",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  tabViewWrapper: {
    width: "70%",
    alignSelf: "center",
    borderRadius: 10,
    overflow: "hidden",
  },
  tabView: {
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default Auth;
