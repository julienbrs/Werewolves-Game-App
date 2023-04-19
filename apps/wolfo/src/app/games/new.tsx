import { Slider } from "@rneui/themed";
import { Datepicker, IndexPath, Input, Layout, Select, SelectItem } from "@ui-kitten/components";
import { Stack } from "expo-router";
import { useState } from "react";
import React, { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NewGame = () => {
  const [selectedIndex, setSelectedIndex] = useState<IndexPath | IndexPath[]>(new IndexPath(0));
  const [gameName, setGameName] = useState("Game name");
  const [gameNameStatus, setGameNameStatus] = useState("basic");
  const [minPlayersIndex, setMinPlayersIndex] = useState<IndexPath | IndexPath[]>(new IndexPath(4));
  const [maxPlayersIndex, setMaxPlayersIndex] = useState<IndexPath | IndexPath[]>(
    new IndexPath(19)
  );
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now()));
  const [startDateline, setDateline] = useState<Date>(new Date(Date.now()));
  const [endDate, setEndDate] = useState<Date>(startDate);
  const [wolfProb, setWolfProb] = useState(50);
  const [seerProb, setSeerProb] = useState(50);
  const [insomProb, setInsomProb] = useState(50);
  const [contProb, setContProb] = useState(50);
  const [spiritProb, setSpiritProb] = useState(50);
  const styles = StyleSheet.create({
    text: {
      fontWeight: "bold",
    },
    thumbSlider: {
      height: 28,
      backgroundColor: "blue",
      width: 28,
    },
    input: {
      margin: 2,
    },
  });
  return (
    <SafeAreaView>
      <Stack.Screen />
      {/* Page de création de la partie */}
      <Layout level="1">
        <Text style={styles.text}>Select number of players:</Text>
        <View>
          <Text style={styles.text}>Pick the game's name!</Text>
          <Input
            style={styles.input}
            status={gameNameStatus}
            placeholder={gameName}
            value={gameName}
            onChangeText={setGameName}
          />
        </View>
        <Text style={styles.text}>Select number of minimum players:</Text>
        <Select
          placeholder="Default"
          value={selectedIndex.toString()}
          selectedIndex={selectedIndex}
          onSelect={index => setSelectedIndex(index)}
          value={minPlayersIndex.toString()}
          selectedIndex={minPlayersIndex}
          onSelect={index => {
            setMinPlayersIndex(index);
            if (Number(maxPlayersIndex.toString()) < Number(minPlayersIndex.toString())) {
              setMaxPlayersIndex(index);
            }
          }}
        >
          {Array.from(Array(20).keys()).map(n => (
            <SelectItem key={n} title={n + 1 + ""} />
          ))}
          {Array.from(Array(20).keys())
            .slice(4)
            .map(n => (
              <SelectItem key={n} title={n + 1 + ""} />
            ))}
        </Select>
        <Text style={styles.text}>Select number of players:</Text>
        <Text style={styles.text}>Select number of maximum players:</Text>
        <Select
          placeholder="Default"
          value={selectedIndex.toString()}
          selectedIndex={selectedIndex}
          onSelect={index => setSelectedIndex(index)}
          value={maxPlayersIndex.toString()}
          selectedIndex={maxPlayersIndex}
          onSelect={index => setMaxPlayersIndex(index)}
        >
          {Array.from(Array(20).keys())
            .slice(Number(selectedIndex.toString()))
            .slice(Number(minPlayersIndex.toString()) - 1)
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
        <View id="dateline">
          <Text style={styles.text}>Select start date:</Text>
          <Datepicker date={startDateline} min={startDateline} onSelect={setDateline} />
        </View>

        {/* Sliders */}
        <View id="wolfProb">
          <Text style={styles.text}>Wolf probability: {wolfProb}%</Text>
          <Slider
            thumbStyle={styles.thumbSlider}
            animationType="timing"
            minimumValue={0}
            maximumValue={100}
            onValueChange={setWolfProb}
            value={wolfProb}
            step={1}
          />
        </View>
        {/* Contamination Prob */}
        <View id="contProb">
          <Text style={styles.text}>Contamination probability: {contProb}%</Text>
          <Slider
            thumbStyle={styles.thumbSlider}
            animationType="timing"
            minimumValue={0}
            maximumValue={100}
            onValueChange={setContProb}
            value={contProb}
            step={1}
          />
        </View>
        {/* Seer Prob */}
        <View id="seerProb">
          <Text style={styles.text}>Seer probability: {seerProb}%</Text>
          <Slider
            thumbStyle={styles.thumbSlider}
            animationType="timing"
            minimumValue={0}
            maximumValue={100}
            onValueChange={setSeerProb}
            value={seerProb}
            step={1}
          />
        </View>
        {/* Insomniac Prob */}
        <View id="insomProb">
          <Text style={styles.text}>Insomniac probability: {insomProb}%</Text>
          <Slider
            thumbStyle={styles.thumbSlider}
            animationType="timing"
            minimumValue={0}
            maximumValue={100}
            onValueChange={setInsomProb}
            value={insomProb}
            step={1}
          />
        </View>
        {/* Spirit Prob */}
        <View id="spiritProb">
          <Text style={styles.text}>Spirit probability: {spiritProb}%</Text>
          <Slider
            thumbStyle={styles.thumbSlider}
            animationType="timing"
            minimumValue={0}
            maximumValue={100}
            onValueChange={setSpiritProb}
            value={spiritProb}
            step={1}
          />
        </View>
      </Layout>
    </SafeAreaView>
  );
};

export default NewGame;
