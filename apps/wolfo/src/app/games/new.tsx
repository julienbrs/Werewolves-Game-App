import { Slider } from "@rneui/themed";
import { useMutation } from "@tanstack/react-query";
import { Button, IndexPath, Input, Layout, Select, SelectItem } from "@ui-kitten/components";
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

  const [gameName, setGameName] = useState("");
  const [gameNameStatus, setGameNameStatus] = useState("basic");
  const [minPlayersIndex, setMinPlayersIndex] = useState<IndexPath | IndexPath[]>(new IndexPath(0));
  const [maxPlayersIndex, setMaxPlayersIndex] = useState<IndexPath | IndexPath[]>(
    new IndexPath(maxPlayers - minPlayers)
  );
  /* Time picking states */
  const [startDay, setStartDay] = useState<Date>(new Date(1970, 0, 1, 8, 0, 0, 0));
  const [startDayVisibility, setStartDayVisibility] = useState<boolean>(false);

  const [endDay, setEndDay] = useState<Date>(new Date(1970, 0, 1, 20, 0, 0, 0));
  const [startEndVisibility, setEndDayVisibility] = useState<boolean>(false);

  const [startDateline, setDateline] = useState<Date>(new Date(Date.now()));
  const [startDatelineVisibility, setStartDatelineVisibility] = useState<boolean>(false);

  /* Probabilities */
  const [wolfProb, setWolfProb] = useState(0);
  const [seerProb, setSeerProb] = useState(0);
  const [insomProb, setInsomProb] = useState(0);
  const [contProb, setContProb] = useState(0);
  const [spiritProb, setSpiritProb] = useState(0);

  /* Special time callbacks */
  const confirmStartDay = (date: Date) => {
    if (
      endDay.getHours() > date.getHours() ||
      (endDay.getHours() === date.getHours() && endDay.getMinutes() > date.getMinutes())
    ) {
      setStartDay(new Date(date.getTime()));
    }
    setStartDayVisibility(false);
  };
  const confirmEndDay = (date: Date) => {
    if (
      date.getHours() > startDay.getHours() ||
      (date.getHours() === startDay.getHours() && date.getMinutes() > startDay.getMinutes())
    ) {
      setEndDay(new Date(date.getTime()));
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
  const { mutateAsync, isSuccess, isError, error } = useMutation<any, Error, NewGameType>({
    mutationFn: game => createGame(game),
  });

  const newGame = async () => {
    if (gameName.trim() === "") {
      setGameNameStatus("danger");
      return;
    }
    const startDayString = getTimeString(startDay.getHours(), startDay.getMinutes()) + ":00";
    const endDayString = getTimeString(endDay.getHours(), endDay.getMinutes()) + ":00";

    const game: NewGameType = {
      name: gameName,
      state: "LOBBY",
      minPlayer: +minPlayersIndex.toString() + minPlayers - 1,
      maxPlayer: +maxPlayersIndex.toString() + minPlayers - 1,
      deadline: getDateString(startDateline) + "T" + startDayString + ".000Z",
      startDay: "1970-01-01T" + startDayString + ".000Z",
      endDay: "1970-01-01T" + endDayString + ".000Z",
      wolfProb,
      seerProb,
      insomProb,
      contProb,
      spiritProb,
    };
    await mutateAsync(game);

    if (isError) {
      console.log("error");
      console.log(error);
    }
    if (isSuccess) {
      router.back();
    }
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.scrollview}>
        {/* Page de création de la partie */}
        <Layout level="1" style={[styles.container]}>
          <Text style={styles.text}>Pick the game's name!</Text>
          <Input
            style={styles.input}
            status={gameNameStatus}
            placeholder={"Game Name"}
            onChangeText={setGameName}
          />
          <Text style={styles.text}>Select number of minimum players:</Text>
          <Select
            placeholder="Default"
            value={+minPlayersIndex.toString() + minPlayers - 1}
            selectedIndex={minPlayersIndex}
            onSelect={index => {
              setMinPlayersIndex(index);
              if (Number(maxPlayersIndex.toString()) < Number(index.toString())) {
                setMaxPlayersIndex(index);
              }
            }}
          >
            {Array.from(Array(maxPlayers).keys())
              .slice(minPlayers - 1)
              .map(n => (
                <SelectItem key={n} title={n + 1 + ""} />
              ))}
          </Select>
          <Text style={styles.text}>Select number of maximum players:</Text>
          <Select
            placeholder={maxPlayers}
            value={Number(maxPlayersIndex.toString()) + minPlayers - 1}
            selectedIndex={maxPlayersIndex}
            onSelect={index => setMaxPlayersIndex(index)}
          >
            {Array.from(Array(maxPlayers).keys())
              .slice(minPlayers - 1)
              .map(n => (
                <SelectItem
                  key={n}
                  disabled={n < Number(minPlayersIndex.toString()) - 1 + minPlayers - 1}
                  title={n + 1 + ""}
                />
              ))}
          </Select>
          <View id="dateline" style={styles.timepicker}>
            <Text style={styles.text}>Select start date:</Text>
            <Button style={styles.timeButton} onPress={() => setStartDatelineVisibility(true)}>
              {startDateline.getDate() +
                "/" +
                (startDateline.getMonth() + 1) +
                "/" +
                startDateline.getFullYear()}
            </Button>
          </View>
          <DateTimePickerModal
            minimumDate={new Date()}
            date={startDateline}
            isVisible={startDatelineVisibility}
            onConfirm={(date: Date) => {
              setStartDatelineVisibility(false);
              setDateline(date);
            }}
            onCancel={() => hideTimePicker(setStartDatelineVisibility)}
          />
          <View id="startday" style={[styles.timepicker]}>
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
          <View id="endday" style={[styles.timepicker]}>
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
          {/* Contamination Prob */}
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
          {/* Seer Prob */}
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
          {/* Insomniac Prob */}
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
          {/* Spirit Prob */}
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
          <Button onPress={async () => await newGame()}>Create game</Button>
        </Layout>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  scrollview: {
    padding: 0,
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
    padding: 10,
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
