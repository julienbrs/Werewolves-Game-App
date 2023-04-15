import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter, Redirect } from "expo-router";
import { Tab, Input, TabView, Button, Text } from "@rneui/themed";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { login } from "../../utils/api/user";
import { Error, NewUser, User } from "types";
export const Login = () => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { mutate, isSuccess, isError, error } = useMutation<
    any,
    Error,
    NewUser
  >({
    mutationFn: (user) => login(user),
    onError: (error: Error) => {
      console.log(error);
    },
    onSuccess: (data) => {
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
