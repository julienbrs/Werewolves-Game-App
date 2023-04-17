import { Button, Card, Modal, Text } from "@ui-kitten/components";
import React from "react";
import { StyleSheet, View } from "react-native";

interface ModalConfirmChoiceProps {
  title: string;
  description: string;
  visible: boolean;
  setVisible: (value: boolean) => void;
  confirmFunction: () => void;
}
export const ModalConfirmChoice = ({
  title,
  description,
  visible,
  setVisible,
  confirmFunction,
}: ModalConfirmChoiceProps) => {
  return (
    <Modal
      visible={visible}
      onBackdropPress={() => setVisible(false)}
      style={styles.backdrop}
      animationType="fade"
    >
      <Card disabled={true}>
        <Text>{title}</Text>
        <Text>{description}</Text>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => setVisible(false)}
            style={{ ...styles.button, ...styles.cancelButton }}
          >
            Cancel
          </Button>
          <Button
            onPress={() => {
              setVisible(false);
              confirmFunction();
            }}
            style={styles.button}
          >
            Confirm
          </Button>
        </View>
      </Card>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "green",
  },
  button: {
    flex: 1,
    marginLeft: 5,
    marginRight: 5,
    width: "20%",
  },
  cancelButton: {
    backgroundColor: "red",
    borderColor: "red",
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
