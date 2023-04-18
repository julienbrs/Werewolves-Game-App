import { QueryClient, useMutation } from "@tanstack/react-query";
import { Button, Input, Text } from "@ui-kitten/components";
import { Redirect } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Error, NewUser } from "types";
import { login } from "../../utils/api/user";
export const Login = () => {
  const queryClient = new QueryClient();
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { mutate, isSuccess, isError, error } = useMutation<any, Error, NewUser>({
    mutationFn: user => login(user),
    onSuccess: data => {
      queryClient.setQueryData(["token"], data.token);
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
      <Button onPress={handleLogin}>Login</Button>
      {isError && <Text>{error.message}</Text>}
    </SafeAreaView>
  );
};
