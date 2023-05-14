import { Button, Text } from "@ui-kitten/components";
import React from "react";
import { Image, Modal, StyleSheet, View } from "react-native";
import { Game, Player } from "types";
import aliveIcon from "../../../assets/UI/alive.png";
import deadIcon from "../../../assets/UI/dead.png";

interface ModalPlayersProps {
  game: Game;
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
}

export const ModalPlayers = ({ game, modalVisible, setModalVisible }: ModalPlayersProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{game.players.length} players in game</Text>
          <View style={styles.iconWrapper}>
            <Image source={aliveIcon} style={styles.icon} />
            <Text style={styles.text}>Alive players :</Text>
          </View>
          <Text style={styles.modalText}>
            {game.players
              .filter((p: Player) => p.state === "ALIVE")
              .map((p: Player) => p.user?.name)
              .join(", ")}
          </Text>
          <View style={styles.iconWrapper}>
            <Image source={deadIcon} style={styles.icon} />
            <Text style={styles.text}>Dead players :</Text>
          </View>
          <Text style={styles.modalText}>
            {game.players
              .filter((p: Player) => p.state === "DEAD")
              .map((p: Player) => p.user?.name)
              .join(", ")}
          </Text>

          <Button onPress={() => setModalVisible(!modalVisible)}>
            {evaProps => (
              <Text {...evaProps} style={styles.smallText}>
                Close
              </Text>
            )}
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    fontFamily: "Montserrat",
    textAlign: "center",
    color: "#C38100",
  },
  smallText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: -10,
  },
  iconWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 8,
    marginTop: 20,
  },
});

export default ModalPlayers;
