import { Button, Input } from "@rneui/themed";
import { useMutation } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Error, NewUser } from "types";
import { createUser } from "../../utils/api/user";
export const Register = () => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { mutate, isSuccess } = useMutation<any, Error, NewUser>({
    mutationFn: user => createUser(user),
    onError: error => {
      console.log(error);
    },
    onSuccess: data => {
      console.log(data);
      SecureStore.setItemAsync("token", data.token);
    },
  });

  const handleRegister = () => {
    const user: NewUser = {
      name,
      password,
    };
    mutate(user);
  };
  if (isSuccess) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView>
      <Input placeholder="Name" onChangeText={setName} />
      <Input placeholder="Password" onChangeText={setPassword} />
      <Button title={"Register"} onPress={handleRegister} />
    </SafeAreaView>
  );
};
