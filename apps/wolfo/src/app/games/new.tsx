import { Slider } from "@rneui/themed";
import {
  Button,
  Datepicker,
  IndexPath,
  Input,
  Layout,
  Select,
  SelectItem
} from "@ui-kitten/components";
import { useRouter } from "expo-router";
import { useState } from "react";
import React, { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NewGame = () => {
  const router = useRouter();
  const [gameName, setGameName] = useState("Game name");
  const [gameNameStatus, setGameNameStatus] = useState("basic");
  const [minPlayersIndex, setMinPlayersIndex] = useState<IndexPath | IndexPath[]>(new IndexPath(4));
  const [maxPlayersIndex, setMaxPlayersIndex] = useState<IndexPath | IndexPath[]>(
    new IndexPath(19)
  );
  const [startDateline, setDateline] = useState<Date>(new Date(Date.now()));
  const [wolfProb, setWolfProb] = useState(0);
  const [seerProb, setSeerProb] = useState(0);
  const [insomProb, setInsomProb] = useState(0);
  const [contProb, setContProb] = useState(0);
  const [spiritProb, setSpiritProb] = useState(0);

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
    container: {
      display: "flex",
      gap: 20,
    },
    view: {
      paddingHorizontal: 10,
    },
  });
  return (
    <SafeAreaView>
      {/* Page de création de la partie */}
      <Layout level="1" style={styles.container}>
        <View style={styles.view}>
          <Text style={styles.text}>Pick the game's name!</Text>
          <Input
            style={styles.input}
            status={gameNameStatus}
            placeholder={gameName}
            value={gameName}
            onChangeText={setGameName}
          />
        </View>
        <View style={styles.view}>
          <Text style={styles.text}>Select number of minimum players:</Text>
          <Select
            placeholder="Default"
            value={minPlayersIndex.toString()}
            selectedIndex={minPlayersIndex}
            onSelect={index => {
              setMinPlayersIndex(index);
              if (Number(maxPlayersIndex.toString()) < Number(minPlayersIndex.toString())) {
                setMaxPlayersIndex(index);
              }
            }}
          >
            {Array.from(Array(20).keys())
              .slice(4)
              .map(n => (
                <SelectItem key={n} title={n + 1 + ""} />
              ))}
          </Select>
        </View>
        <View style={styles.view}>
          <Text style={styles.text}>Select number of maximum players:</Text>
          <Select
            placeholder="Default"
            value={maxPlayersIndex.toString()}
            selectedIndex={maxPlayersIndex}
            onSelect={index => setMaxPlayersIndex(index)}
          >
            {Array.from(Array(20).keys())
              .slice(Number(minPlayersIndex.toString()) - 1)
              .map(n => (
                <SelectItem key={n} title={n + 1 + ""} />
              ))}
          </Select>
        </View>
        <View id="dateline" style={styles.view}>
          <Text style={styles.text}>Select start date:</Text>
          <Datepicker date={startDateline} min={startDateline} onSelect={setDateline} />
        </View>

        {/* Sliders */}
        <View id="wolfProb" style={styles.view}>
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
        <View id="contProb" style={styles.view}>
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
        <View id="seerProb" style={styles.view}>
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
        <View id="insomProb" style={styles.view}>
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
        <View id="spiritProb" style={styles.view}>
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
        <Button onPress={() => router.back()}>Create game</Button>
      </Layout>
    </SafeAreaView>
  );
};

export default NewGame;
