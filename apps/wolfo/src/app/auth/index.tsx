import { Ionicons } from "@expo/vector-icons";
import { Button } from "@ui-kitten/components";
import React, { useState } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import imgBackground from "../../../assets/homepage_day.png";
import { Login } from "../../components/auth/login";

const Auth = () => {
  const [showLogin, setShowLogin] = useState<boolean>(false);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleRegisterClick = () => {
    // Handle register button click
  };

  const handleCloseClick = () => {
    setShowLogin(false);
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={imgBackground} style={styles.image}>
        {showLogin ? (
          <>
            <View style={styles.closeButtonContainer}>
              <Button
                appearance="ghost"
                accessoryLeft={() => (
                  <Ionicons
                    name="close-outline"
                    size={24}
                    color="#fff"
                    onPress={handleCloseClick}
                  />
                )}
              />
            </View>
            <Login />
          </>
        ) : (
          <View style={styles.buttonContainer}>
            <Button style={styles.button} onPress={handleLoginClick}>
              Login
            </Button>
            <Button style={styles.button} onPress={handleRegisterClick}>
              Register
            </Button>
          </View>
        )}
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
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginHorizontal: 10,
  },
  closeButtonContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
});

export default Auth;
