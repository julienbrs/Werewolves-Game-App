import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Text } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Error, User } from "types";
import Loading from "../../components/loading";
import { setToken } from "../../utils/api/api";
import { deleteUser, getMe, updateUser } from "../../utils/api/user";

const Settings = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [enableMe, setEnableMe] = useState<boolean>(true);
  const router = useRouter();
  const queryClient = useQueryClient();
  queryClient.invalidateQueries(["auth"]);
  const {
    data: user,
    isLoading: isLoadingUser,
    isError,
  } = useQuery<User>({
    queryFn: getMe,
    queryKey: ["user"],
    enabled: enableMe,
  });
  const { mutate: updateQuery } = useMutation<any, Error, User>({
    mutationFn: userUpdated => updateUser(userUpdated),
    onSuccess: data => {
      SecureStore.setItemAsync("token", data.token);
      queryClient.invalidateQueries(["user"]);
      setToken(data.token);
      setErrorMessage("");
    },
    onError: (error: Error) => {
      setErrorMessage(error.message);
    },
  });
  const { mutate: deleteQuery } = useMutation<any, Error>({
    mutationFn: deleteUser,
    onSuccess: async () => {
      setEnableMe(false);
      setToken(null);
      await SecureStore.deleteItemAsync("token");
      await queryClient.invalidateQueries(["user"]);
      await queryClient.invalidateQueries(["auth"]);
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
  const logout = async () => {
    setEnableMe(false);
    setToken(null);
    await SecureStore.deleteItemAsync("token");
    await queryClient.invalidateQueries(["user"]);
    await queryClient.invalidateQueries(["auth"]);
    router.back();
  };
  return (
    <SafeAreaView>
      <Text>{user.name}'s settings</Text>
      <Input placeholder="Username" onChangeText={setName} />
      <Input placeholder="Password" onChangeText={setPassword} />
      <Input placeholder="Confirm password" onChangeText={setConfirmPassword} />

      <Button onPress={handleModify}>Modifier le compte</Button>
      <Button onPress={() => deleteQuery()}>Supprimer le compte</Button>
      <Button onPress={() => logout()}>Se déconnecter</Button>
      {errorMessage && <Text>{errorMessage}</Text>}
    </SafeAreaView>
  );
};

export default Settings;
