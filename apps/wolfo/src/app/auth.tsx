import { Text, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";


const Auth = () => {
  const router = useRouter();
  return (
    <SafeAreaView>
        <Text>Auth</Text>
        <Button title="Go Back" onPress={() => router.back()}/>
    </SafeAreaView>
  );
};

export default Auth;