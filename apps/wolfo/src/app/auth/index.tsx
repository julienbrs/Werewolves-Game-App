import { light as lightTheme, mapping } from "@eva-design/eva";
import { ApplicationProvider, Tab, TabView } from "@ui-kitten/components";
import React, { useState } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import imgBackground from "../../../assets/homepage_day.png";
import { Login } from "../../components/auth/login";
import { Register } from "../../components/auth/register";

const theme = {
  ...lightTheme,
  "color-primary-100": "#ffe3d7",
  "color-primary-200": "#ffc1b3",
  "color-primary-300": "#ffa28f",
  "color-primary-400": "#ff876f",
  "color-primary-500": "#914f49",
  "color-primary-600": "#db4a34",
  "color-primary-700": "#b53120",
  "color-primary-800": "#8f1c13",
  "color-primary-900": "#741108",
};

const Auth = () => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  return (
    <ApplicationProvider mapping={mapping} theme={theme}>
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
    </ApplicationProvider>
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
