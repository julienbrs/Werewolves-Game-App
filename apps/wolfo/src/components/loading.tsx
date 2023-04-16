import { Text } from "@rneui/themed";
import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LoadingProps {
  title: string;
  message: string;
}
const Loading: React.FC<LoadingProps> = ({ title, message }) => {
  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={styles.content}>
        <Text h4 style={styles.title}>
          {title}
        </Text>
        <Text style={styles.message}>{message}</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
  },
  message: {
    fontSize: 16,
    marginTop: 8,
  },
});

export default Loading;
