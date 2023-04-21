import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import io from "socket.io-client";
const socketEndpoint = "http://127.0.0.1:3000";

export function Example() {
  const [hasConnection, setConnection] = useState(true); // Initialiser à true

  useEffect(function didMount() {
    const socket = io(socketEndpoint, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to socket.io");
      setConnection(true);
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from socket.io");
      setConnection(false);
    });

    socket.on("test", data => {
      console.log("test", data);
    });

    return function didUnmount() {
      socket.disconnect();
      socket.removeAllListeners();
    };
  }, []);

  function handlePress() {
    const socket = io(socketEndpoint, {
      transports: ["websocket"],
    });
    console.log("Click ", { hasConnection });
    socket.emit("test-front", { msg: "Hello" });
  }

  return (
    <View style={styles.container}>
      {!hasConnection && (
        <>
          <Text style={styles.paragraph}>Connecting to {socketEndpoint}...</Text>
          <Text style={styles.footnote}>Make sure the backend is started and reachable</Text>
          <Button title="Refresh" onPress={() => handlePress()} />
        </>
      )}

      {hasConnection && (
        <>
          <Text style={[styles.paragraph, { fontWeight: "bold" }]}>Server time</Text>
          <Button
            title="Refresh"
            onPress={() => {
              console.log("has connection = ", { hasConnection });
              handlePress();
            }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  paragraph: {
    fontSize: 16,
  },
  footnote: {
    fontSize: 14,
    fontStyle: "italic",
  },
});

export default Example;
