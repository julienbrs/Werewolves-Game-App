import { Slider } from "@rneui/themed";
import { useMutation } from "@tanstack/react-query";
import {
  Button,
  Datepicker,
  IndexPath,
  Input,
  Layout,
  Select,
  SelectItem,
} from "@ui-kitten/components";
import { useRouter } from "expo-router";
import { Dispatch, SetStateAction, useState } from "react";
import React, { Platform, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { NewGame as NewGameType } from "types";
import { createGame } from "../../utils/api/game";

const NewGame = () => {
  const router = useRouter();
  /* General settings */
  const minPlayers = 5;
  const maxPlayers = 20;

  const [gameName, setGameName] = useState("Game name");
  const [gameNameStatus, setGameNameStatus] = useState("basic");
  const [minPlayersIndex, setMinPlayersIndex] = useState<IndexPath | IndexPath[]>(new IndexPath(0));
  const [maxPlayersIndex, setMaxPlayersIndex] = useState<IndexPath | IndexPath[]>(new IndexPath(0));

  /* Time picking states */
  const [startDay, setStartDay] = useState<Date>(new Date(1970, 1, 1, 8, 0));
  const [startDayVisibility, setStartDayVisibility] = useState<boolean>(false);

  const [endDay, setEndDay] = useState<Date>(new Date(1970, 1, 1, 20, 0));
  const [startEndVisibility, setEndDayVisibility] = useState<boolean>(false);

  const [startDateline, setDateline] = useState<Date>(new Date(Date.now()));

  /* Probabilities */
  const [wolfProb, setWolfProb] = useState(0);
  const [seerProb, setSeerProb] = useState(0);
  const [insomProb, setInsomProb] = useState(0);
  const [contProb, setContProb] = useState(0);
  const [spiritProb, setSpiritProb] = useState(0);

  /* Special time callbacks */
  const confirmStartDay = (date: Date) => {
    console.log(endDay);
    console.log(date);
    if (
      !(
        endDay.getUTCHours() > date.getUTCHours() ||
        (endDay.getUTCHours() === date.getUTCHours() &&
          endDay.getUTCMinutes() > date.getUTCMinutes())
      )
    ) {
      console.log("hello?");
      setStartDay(date);
    }
    setStartDayVisibility(false);
  };
  const confirmEndDay = (date: Date) => {
    if (
      !(
        date.getUTCHours() > startDay.getUTCHours() ||
        (date.getUTCHours() === startDay.getUTCHours() &&
          date.getUTCMinutes() > startDay.getUTCMinutes())
      )
    ) {
      setEndDay(date);
      return;
    }
    setEndDayVisibility(false);
  };
  const hideTimePicker = (setter: Dispatch<SetStateAction<boolean>>) => {
    setter(false);
  };

  const getTimeString = (hours: number, minutes: number): string => {
    return ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2);
  };
  const getDateString = (date: Date): string => {
    return (
      "" +
      date.getFullYear() +
      "-" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + date.getDate()).slice(-2)
    );
  };
  /* Api call */
  const { mutate, isSuccess, isError, error } = useMutation<any, Error, NewGameType>({
    mutationFn: game => createGame(game),
  });

  const newGame = async () => {
    console.log("I'm here");
    const startDayString = getTimeString(startDay.getHours(), startDay.getMinutes()) + ":00";
    const startEndString = getTimeString(endDay.getHours(), endDay.getMinutes()) + ":00";
    const game: NewGameType = {
      name: gameName,
      state: "LOBBY",
      minPlayer: +minPlayersIndex.toString() + minPlayers - 1,
      maxPlayer: +maxPlayersIndex.toString() + +minPlayersIndex.toString() - 1 + minPlayers - 1,
      deadline: getDateString(startDateline) + "T" + startDayString + ".000Z",
      startDay: "1970-01-01T" + startDayString + ".000Z",
      endDay: "1970-01-01T" + startEndString + ".000Z",
      wolfProb,
      seerProb,
      insomProb,
      contProb,
      spiritProb,
    };

    await mutate(game);

    if (isSuccess) {
      router.back();
      return;
    }
    if (isError) {
      console.log("error");
      console.log(error);
      setGameNameStatus("danger");
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        {/* Page de création de la partie */}
        <Layout level="1" style={[styles.container]}>
          <View style={styles.view}>
            <Text style={styles.text}>Pick the game's name!</Text>
            <Input
              style={styles.input}
              status={gameNameStatus}
              placeholder={"Game Name"}
              onChangeText={setGameName}
            />
          </View>
          <View style={styles.view}>
            <Text style={styles.text}>Select number of minimum players:</Text>
            <Select
              placeholder="Default"
              value={+minPlayersIndex.toString() + minPlayers - 1}
              selectedIndex={minPlayersIndex}
              onSelect={index => {
                setMinPlayersIndex(index);
                if (Number(maxPlayersIndex.toString()) < Number(minPlayersIndex.toString())) {
                  setMaxPlayersIndex(new IndexPath(0));
                }
              }}
            >
              {Array.from(Array(maxPlayers).keys())
                .slice(minPlayers - 1)
                .map(n => (
                  <SelectItem key={n} title={n + 1 + ""} />
                ))}
            </Select>
          </View>
          <View style={styles.view}>
            <Text style={styles.text}>Select number of maximum players:</Text>
            <Select
              placeholder="Default"
              value={+maxPlayersIndex.toString() + +minPlayersIndex.toString() - 1 + minPlayers - 1}
              selectedIndex={maxPlayersIndex}
              onSelect={index => setMaxPlayersIndex(index)}
            >
              {Array.from(Array(maxPlayers).keys())
                .slice(Number(minPlayersIndex.toString()) - 1 + minPlayers - 1)
                .map(n => (
                  <SelectItem key={n} title={n + 1 + ""} />
                ))}
            </Select>
          </View>
          <View style={styles.view}>
            <Text style={styles.text}>Select start date:</Text>
          </View>
          <Datepicker date={startDateline} min={new Date()} onSelect={setDateline} />
          <View id="startday" style={[styles.view, styles.timepicker]}>
            <Text style={styles.text}>Pick the day's start time</Text>
            {Platform.OS === "web" ? (
              <Input
                style={styles.timeButton}
                onChangeText={text => setEndDay(new Date(text))}
                placeholder="HH:MM"
              />
            ) : (
              <Button style={styles.timeButton} onPress={() => setStartDayVisibility(true)}>
                {getTimeString(startDay.getHours(), startDay.getMinutes())}
              </Button>
            )}
          </View>
          <DateTimePickerModal
            mode="time"
            is24Hour={true}
            minuteInterval={5}
            isVisible={startDayVisibility}
            onConfirm={confirmStartDay}
            onCancel={() => hideTimePicker(setStartDayVisibility)}
          />
          <View id="endday" style={[styles.view, styles.timepicker]}>
            <Text style={styles.text}>Pick the day's end time</Text>
            {Platform.OS === "web" ? (
              <Input
                style={styles.timeButton}
                onChangeText={text => setEndDay(new Date(text))}
                placeholder="HH:MM"
              />
            ) : (
              <Button style={styles.timeButton} onPress={() => setEndDayVisibility(true)}>
                {getTimeString(endDay.getHours(), endDay.getMinutes())}
              </Button>
            )}
          </View>
          <DateTimePickerModal
            mode="time"
            is24Hour={true}
            minuteInterval={5}
            isVisible={startEndVisibility}
            onConfirm={confirmEndDay}
            onCancel={() => hideTimePicker(setEndDayVisibility)}
          />

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
          <Button onPress={async () => await newGame()}>Create game</Button>
        </Layout>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  layout: {
    margin: "0 0",
    padding: "10",
  },
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
  timepicker: {
    display: "flex",
  },
  timeButton: {
    alignSelf: "flex-end",
    width: "40%",
  },
});
export default NewGame;
