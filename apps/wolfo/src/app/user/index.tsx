import { Button, Input, Text } from "@rneui/themed";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Error, User } from "types";
import Loading from "../../components/loading";
import { deleteUser, getUser, updateUser } from "../../utils/api/user";
const Settings = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    data: user,
    isLoading: isLoadingUser,
    isError,
  } = useQuery<User>({
    queryFn: getUser,
    queryKey: ["user"],
  });
  const { mutate: updateQuery } = useMutation<any, Error, User>({
    mutationFn: userUpdated => updateUser(userUpdated),
    onSuccess: data => {
      SecureStore.setItemAsync("token", data.token);
      queryClient.invalidateQueries(["user"]);
    },
    onError: (error: Error) => {
      setErrorMessage(error.message);
    },
  });
  const { mutate: deleteQuery } = useMutation<any, Error>({
    mutationFn: deleteUser,
    onSuccess: () => {
      SecureStore.deleteItemAsync("token");
      queryClient.invalidateQueries(["user"]);
      router.back();
    },
  });

  if (isLoadingUser) {
    return <Loading title="Loading user informations" message="Waiting" />;
  }
  if (isError) {
    return <Loading title="Error" message="Error" />;
  }

  const handleModify = () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      return;
    }
    const modifiedUser: User = {
      id: user.id,
      name,
      password,
    };
    updateQuery(modifiedUser);
  };

  return (
    <SafeAreaView>
      <Input placeholder="Username" onChangeText={setName} />
      <Input placeholder="Password" onChangeText={setPassword} />
      <Input placeholder="Confirm password" onChangeText={setConfirmPassword} />

      <Button title="Modifier le compte" onPress={handleModify} />
      <Button title="Supprimer le compte" onPress={() => deleteQuery()} />
      {errorMessage && <Text>{errorMessage}</Text>}
    </SafeAreaView>
  );
};

export default Settings;
