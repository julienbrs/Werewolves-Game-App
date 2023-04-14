import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, Stack, useRouter } from "expo-router";
import { Tab, Input, TabView, Button, Text } from "@rneui/themed";
import { useState } from "react";
import { createUser } from "../../utils/api/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Error, User } from "../../utils/types";
import * as SecureStore from "expo-secure-store";
const Register = () => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { mutate, isSuccess, isError, error } = useMutation<any, Error, User>({
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
    const user: User = {
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

export default Register;
