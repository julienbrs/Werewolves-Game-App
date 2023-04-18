import { useMutation } from "@tanstack/react-query";
import { Button, Input } from "@ui-kitten/components";
import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Error, NewUser } from "types";
import { createUser } from "../../utils/api/user";
export const Register = () => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { data, mutate, isSuccess } = useMutation<any, Error, NewUser>({
    mutationFn: user => createUser(user),
  });

  const handleRegister = () => {
    const user: NewUser = {
      name,
      password,
    };
    mutate(user);
  };
  if (isSuccess) {
    SecureStore.setItemAsync("token", data.token);
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView>
      <Input placeholder="Name" onChangeText={setName} />
      <Input placeholder="Password" onChangeText={setPassword} />
      <Button onPress={handleRegister}>Register</Button>
    </SafeAreaView>
  );
};
