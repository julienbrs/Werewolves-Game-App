import { Button, Card, Modal, Text } from "@ui-kitten/components";
import React from "react";
import { StyleSheet } from "react-native";
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
        <Button onPress={() => setVisible(false)} style={styles.buttons}>
          Cancel
        </Button>
        <Button
          onPress={() => {
            setVisible(false);
            confirmFunction();
          }}
          style={styles.buttons}
        >
          Confirm
        </Button>
      </Card>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "green",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "50%",
  },
});
