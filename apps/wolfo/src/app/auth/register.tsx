import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, Stack, useRouter } from "expo-router";
import { Tab, Input, TabView, Button, Text } from "@rneui/themed";
import { useState } from "react";
import { createUser } from "../../utils/api/user";
import { useMutation } from "@tanstack/react-query";
import { Error, NewUser, User } from "types";
import * as SecureStore from "expo-secure-store";
export const Register = () => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { mutate, isSuccess } = useMutation<any, Error, NewUser>({
    mutationFn: (user) => createUser(user),
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
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
