import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Text } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Error, User } from "types";
import imgBackground from "../../../assets/homepage_lobby.png";
import { AuthContext } from "../../components/context/tokenContext";
import { ModalConfirmChoice } from "../../components/modals/modalConfirm";
import { setTokenApi } from "../../utils/api/api";
import { deleteUser, updateUser } from "../../utils/api/user";

const Settings = () => {
  const { name: defaultName, id, handleSetToken } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [name, setName] = useState<string>(defaultName);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const router = useRouter();
  const queryClient = useQueryClient();
  const [visibleDelete, setVisibleDelete] = useState<boolean>(false);
  const [visibleModify, setVisibleModify] = useState<boolean>(false);

  const { mutate: updateQuery } = useMutation<any, Error, User>({
    mutationFn: userUpdated => updateUser(userUpdated),
    onSuccess: data => {
      handleSetToken(data.token);
      setErrorMessage("");
    },
    onError: (error: Error) => {
      setErrorMessage(error.message);
    },
  });
  const { mutate: deleteQuery } = useMutation<any, Error>({
    mutationFn: deleteUser,
    onSuccess: async () => {
      setTokenApi(null);
      handleSetToken(null);
      await queryClient.invalidateQueries();
      router.back();
    },
  });
  const logout = async () => {
    setTokenApi(null);
    handleSetToken(null);
    await queryClient.invalidateQueries();
    router.push("/(auth)/");
  };
  const handleModify = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      return;
    }
    await queryClient.invalidateQueries(["token"]);
    updateQuery({ id, name, password });
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <ImageBackground source={imgBackground} style={styles.image}>
          <View style={styles.centeredView}>
            <Text style={styles.title}>{name}'s settings</Text>
            <Input
              placeholder="Username"
              onChangeText={setName}
              testID="update-username-input"
              style={styles.input}
            />
            <Input
              placeholder="Password"
              onChangeText={setPassword}
              testID="update-password-input"
              style={styles.input}
            />
            <Input
              placeholder="Confirm password"
              onChangeText={setConfirmPassword}
              testID="confirm-update-password-input"
              style={styles.input}
            />

            <Button
              onPress={() => setVisibleModify(true)}
              testID="update-account-button"
              style={[styles.button, styles.modifyButton]}
            >
              Modifier le compte
            </Button>
            <Button
              onPress={() => setVisibleDelete(true)}
              testID="delete-account-button"
              style={styles.button}
            >
              Supprimer le compte
            </Button>
            <Button onPress={() => logout()} testID="logout-button" style={styles.button}>
              Se déconnecter
            </Button>
            {errorMessage && <Text>{errorMessage}</Text>}
          </View>
        </ImageBackground>
      </View>
      <ModalConfirmChoice
        title="Confirm modification"
        description="Voulez vous modifier vos informations?"
        visible={visibleModify}
        setVisible={setVisibleModify}
        confirmFunction={handleModify}
      />

      <ModalConfirmChoice
        title="Delete your account"
        description="Voulez vous supprimer votre compte?"
        visible={visibleDelete}
        setVisible={setVisibleDelete}
        confirmFunction={deleteQuery}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    alignItems: "center",
    justifyContent: "center",
    width: "70%",
    paddingTop: "15%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    width: "100%",
    marginVertical: 10,
    borderRadius: 20,
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.15)",
  },
  input: {
    width: "100%",
    marginVertical: 5,
    borderRadius: 20,
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.15)",
  },
  modifyButton: {
    marginBottom: 20,
    backgroundColor: "#d37c4c",
    borderColor: "#d37c4c",
  },
});

export default Settings;
