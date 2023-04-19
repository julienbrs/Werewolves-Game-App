import {
  Datepicker,
  IndexPath,
  Layout,
  Select,
  SelectItem
} from "@ui-kitten/components";
import { Stack } from "expo-router";
import { useState } from "react";
import React, { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NewGame = () => {
  const [selectedIndex, setSelectedIndex] = useState<IndexPath | IndexPath[]>(new IndexPath(0));
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now()));
  const [endDate, setEndDate] = useState<Date>(startDate);
  const styles = StyleSheet.create({
    text: {
      fontWeight: "bold",
    },
  });
  return (
    <SafeAreaView>
      <Stack.Screen />
      {/* Page de création de la partie */}
      <Layout level="1">
        <Text style={styles.text}>Select number of players:</Text>
        <Select
          placeholder="Default"
          value={selectedIndex.toString()}
          selectedIndex={selectedIndex}
          onSelect={index => setSelectedIndex(index)}
        >
          {Array.from(Array(20).keys()).map(n => (
            <SelectItem key={n} title={n + 1 + ""} />
          ))}
        </Select>
        <Text style={styles.text}>Select number of players:</Text>
        <Select
          placeholder="Default"
          value={selectedIndex.toString()}
          selectedIndex={selectedIndex}
          onSelect={index => setSelectedIndex(index)}
        >
          {Array.from(Array(20).keys())
            .slice(Number(selectedIndex.toString()))
            .map(n => (
              <SelectItem key={n} title={n + 1 + ""} />
            ))}
        </Select>
        <Text style={styles.text}>Select start date:</Text>
        <Datepicker
          date={startDate}
          min={startDate}
          onSelect={d => {
            setStartDate(d);
            /* Update end date if sooner than start date */
            if (d.valueOf() > endDate.valueOf()) {
              setEndDate(d);
            }
          }}
        />
        <Text style={styles.text}>Select end date:</Text>
        <Datepicker date={endDate} min={startDate} onSelect={d => setEndDate(d)} />
      </Layout>
    </SafeAreaView>
  );
};

export default NewGame;
