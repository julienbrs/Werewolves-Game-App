import { Button, Input, Text } from "@rneui/themed";
import { useMutation } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Error, NewUser } from "types";
import { login } from "../../utils/api/user";
export const Login = () => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { mutate, isSuccess, isError, error } = useMutation<any, Error, NewUser>({
    mutationFn: user => login(user),
    onSuccess: data => {
      console.log(data);
      SecureStore.setItemAsync("token", data.token);
    },
  });
  const handleLogin = () => {
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
      <Input placeholder="Username" onChangeText={setName} />
      <Input placeholder="Password" onChangeText={setPassword} />
      <Button title="Login" onPress={handleLogin} />
      {isError && <Text>{error.message}</Text>}
    </SafeAreaView>
  );
};
