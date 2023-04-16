import React, { useState } from "react";
import { Text, TextInput, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Error } from "types";
import * as SecureStore from "expo-secure-store";
import { deleteUser } from "../../utils/api/user";
import { useMutation } from "@tanstack/react-query";


const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

export const Delete = () => {
    const { mutate, isSuccess, isError, error } = useMutation<any, Error, number>({
        mutationFn: id => deleteUser(id),
        onError: (error: Error) => {
            console.log(error);
        },
        onSuccess: data => {
            console.log(data);
            SecureStore.setItemAsync("token", data.token);
        },
    });

    const handleDelete = () => {
        const token = SecureStore.getItemAsync("token");
        const decodedToken = jwt.verify(token, SECRET);
        const id = decodedToken.id;

        mutate(id);
    };

    return (
        <SafeAreaView>

            <Button title="Supprimer le compte" onPress={handleDelete} />

        </SafeAreaView>
    );
}
