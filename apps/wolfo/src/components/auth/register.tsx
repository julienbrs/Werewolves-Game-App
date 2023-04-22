import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Input } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Error, NewUser } from "types";
import { setToken } from "../../utils/api/api";
import { createUser } from "../../utils/api/user";
export const Register = () => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate } = useMutation<any, Error, NewUser>({
    mutationFn: user => createUser(user),
    onSuccess: async data => {
      setToken(data.token);
      await queryClient.invalidateQueries(["token"]);
      router.replace("/");
    },
  });

  const handleRegister = () => {
    const user: NewUser = {
      name,
      password,
    };
    mutate(user);
  };
  return (
    <SafeAreaView>
      <Input placeholder="Name" onChangeText={setName} />
      <Input placeholder="Password" onChangeText={setPassword} />
      <Button onPress={handleRegister}>Register</Button>
    </SafeAreaView>
  );
};
