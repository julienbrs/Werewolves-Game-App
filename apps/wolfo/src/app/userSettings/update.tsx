import React, { useState } from "react";
import { Text, TextInput, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Error, User } from "types";
import { useMutation } from "@tanstack/react-query";
import { updateUser } from "../../utils/api/user";
import * as SecureStore from "expo-secure-store";

export const Update = () => {
    const [newUsername, setNewUsername] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const { mutate, isSuccess, isError, error } = useMutation<any, Error, User>({
        mutationFn: user => updateUser(user),
        onError: (error: Error) => {
            console.log(error);
        },
        onSuccess: data => {
            console.log(data);
            SecureStore.setItemAsync("token", data.token);
        },
    });

    const handleUpdate = () => {

        if (newPassword !== confirmNewPassword) {
            setErrorMessage("Les nouveaux mots de passe ne correspondent pas.");
            return;
        }

        const user: User = {
            name: newUsername,
            password: newPassword,
        }

        mutate(user);

    };

    return (
        <SafeAreaView>
            <Text>Nom d'utilisateur :</Text>
            <TextInput value={newUsername} onChangeText={setNewUsername} />

            <Text>Nouveau mot de passe :</Text>
            <TextInput value={newPassword} onChangeText={setNewPassword} secureTextEntry={true} />

            <Text>Confirmer le nouveau mot de passe :</Text>
            <TextInput value={confirmNewPassword} onChangeText={setConfirmNewPassword} secureTextEntry={true} />

            <Button title="Modifier le compte" onPress={handleUpdate} />

            {errorMessage && <Text>{errorMessage}</Text>}
        </SafeAreaView>
    );
}

