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
      backdropStyle={styles.backdrop}
      visible={visible}
      onBackdropPress={() => setVisible(false)}
      animationType="fade"
    >
      <Card>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
