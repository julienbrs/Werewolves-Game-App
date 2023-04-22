import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Text } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Error, NewUser } from "types";
import { setToken } from "../../utils/api/api";
import { login } from "../../utils/api/user";
export const Login = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { mutate, isError, error } = useMutation<any, Error, NewUser>({
    mutationFn: user => login(user),
    onSuccess: async data => {
      setToken(data.token);
      await queryClient.invalidateQueries(["token"]);
      router.replace("/");
    },
  });
  const handleLogin = () => {
    const user: NewUser = {
      name,
      password,
    };
    mutate(user);
  };
  return (
    <SafeAreaView>
      <Input placeholder="Username" onChangeText={setName} />
      <Input placeholder="Password" onChangeText={setPassword} />
      <Button onPress={handleLogin}>Login</Button>
      {isError && <Text>{error.message}</Text>}
    </SafeAreaView>
  );
};
