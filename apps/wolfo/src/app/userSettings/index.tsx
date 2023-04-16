import { Text, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { Tab, Input, TabView } from "@rneui/themed";
import { useState } from "react";
import { Delete } from "./delete";
import { Update } from "./update";

const Settings = () => {
    const router = useRouter();
    const [tabIndex, setTabIndex] = useState<number>(0);
    return (
        <>
            <Tab value={tabIndex} onChange={setTabIndex}>
                <Tab.Item title="Update Account" />
                <Tab.Item title="Delete Account" />
            </Tab>
            <TabView value={tabIndex} onChange={setTabIndex}>
                <TabView.Item style={{ width: "100%" }}>
                    <Update />
                </TabView.Item>
                <TabView.Item style={{ width: "100%" }}>
                    <Delete />
                </TabView.Item>
            </TabView>
        </>
    );
};

export default Settings;
