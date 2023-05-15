import { Text } from "@ui-kitten/components";
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
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <ActivityIndicator size="large" color="#C38100" />
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#141313",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    color: "#C38100",
  },
  title: {
    fontSize: 30,
    color: "#C38100",
    fontWeight: "bold",
  },
  message: {
    color: "#C38100",
    fontSize: 16,
    marginTop: 8,
  },
});

export default Loading;
