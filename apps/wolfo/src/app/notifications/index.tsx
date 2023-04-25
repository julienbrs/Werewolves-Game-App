import { useQuery } from "@tanstack/react-query";
import { Divider, List, ListItem } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Notification } from "types";
import Loading from "../../components/loading";
import { getNotifications } from "../../utils/api/notification";
const Auth = () => {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  if (isLoading) {
    return <Loading title="Loading notifications" message="oui" />;
  }
  if (isError) {
    return router.back();
  }
  const listNotification = ({ item }: { item: Notification; index: number }) => (
    <ListItem
      key={item.id}
      title={item.title}
      description={item.content}
      onPress={() => router.push(item.link)}
    />
  );

  return (
    <SafeAreaView>
      <List
        data={data}
        renderItem={listNotification}
        ItemSeparatorComponent={Divider}
        onRefresh={refetch}
        refreshing={isLoading}
      />
    </SafeAreaView>
  );
};

export default Auth;
