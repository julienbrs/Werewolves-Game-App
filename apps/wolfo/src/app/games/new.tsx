import { Slider } from "@rneui/themed";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, IndexPath, Input, Layout, Select, SelectItem } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import { Dispatch, SetStateAction, useState } from "react";
import React, {
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { NewGame as NewGameType, StateGame } from "types";
import { createGame } from "../../utils/api/game";

import { ScrollView } from "react-native-gesture-handler";
import imgCalendar from "../../../assets/calendar.png";
import imgHut from "../../../assets/hut.png";
import imgNight from "../../../assets/night.png";
import imgOwl from "../../../assets/owl.png";
import imgParchemin from "../../../assets/parchemin.png";
import imgPotion from "../../../assets/potion.png";
import imgSeer from "../../../assets/seer.png";
import imgSpirit from "../../../assets/spirit.png";
import imgSun from "../../../assets/sun.png";
import imgBackground from "../../../assets/sunny_village.png";
import imgVillage from "../../../assets/village.png";
import imgWolf_Howl from "../../../assets/wolf_howl.png";

const NewGame = () => {
  const router = useRouter();
  /* General settings */
  const minPlayers = 5;
  const maxPlayers = 20;
  const queryClient = useQueryClient();
  const [gameName, setGameName] = useState("Game name");
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

  const [deadline, setDeadline] = useState<Date>(new Date(Date.now()));
  const [startDatelineVisibility, setStartDatelineVisibility] = useState<boolean>(false);

  /* Probabilities */
  const [wolfProb, setWolfProb] = useState<number>(33);
  const [seerProb, setSeerProb] = useState<number>(0);
  const [insomProb, setInsomProb] = useState<number>(0);
  const [contProb, setContProb] = useState<number>(0);
  const [spiritProb, setSpiritProb] = useState<number>(0);

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
  const { mutate } = useMutation<any, Error, NewGameType>({
    mutationFn: game => createGame(game),
    retry: 2,
    onSuccess: () => {
      queryClient.invalidateQueries(["mygames"]);
      router.back();
    },
    onError: () => {
      console.log("Error");
      setGameNameStatus("danger");
    },
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
      state: StateGame.LOBBY,
      minPlayer: +minPlayersIndex.toString() + minPlayers - 1,
      maxPlayer: +maxPlayersIndex.toString() + minPlayers - 1,
      deadline: getDateString(deadline) + "T" + startDayString + ".000Z",
      startDay: "1970-01-01T" + startDayString + ".000Z",
      endDay: "1970-01-01T" + endDayString + ".000Z",
      wolfProb: wolfProb / 100,
      seerProb: seerProb / 100,
      insomProb: insomProb / 100,
      contProb: contProb / 100,
      spiritProb: spiritProb / 100,
    };
    console.log(game.deadline, game.startDay, game.endDay);
    mutate(game);
  };
  return (
    <SafeAreaView style={styles.body}>
      <ScrollView>
        {/* Page de création de la partie */}
        <Layout level="1" style={[styles.container]}>
          <ImageBackground source={imgBackground} style={styles.imageBackground}>
            <View style={styles.viewWrapper}>
              <View style={styles.wrapperSelect}>
                <View style={styles.wrapperImageText}>
                  <View style={styles.imageWrapper}>
                    <Image source={imgParchemin} style={styles.icon} />
                  </View>
                  <Text style={styles.text}>Game's name:</Text>
                </View>
                <Input
                  style={styles.input}
                  status={gameNameStatus}
                  placeholder={"Millers Hollow"}
                  onChangeText={setGameName}
                />
              </View>

              <View style={styles.wrapperSelect}>
                <View style={styles.wrapperImageText}>
                  <View style={styles.imageWrapper}>
                    <Image source={imgHut} style={styles.icon} />
                  </View>
                  <Text style={styles.text}>Minimum players:</Text>
                </View>
                <Select
                  placeholder="Default"
                  style={styles.input}
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
              </View>
              <View style={styles.wrapperSelect}>
                <View style={styles.wrapperImageText}>
                  <View style={styles.imageWrapper}>
                    <Image source={imgVillage} style={styles.icon} />
                  </View>
                  <Text style={styles.text}>Maximum players:</Text>
                </View>
                <Select
                  style={styles.input}
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
              </View>
              <View id="dateline" style={styles.wrapperSelect}>
                <View style={styles.wrapperImageText}>
                  <View style={styles.imageWrapper}>
                    <Image source={imgCalendar} style={styles.icon} />
                  </View>
                  <Text style={styles.text}>Start date:</Text>
                </View>
                <Button style={styles.timeButton} onPress={() => setStartDatelineVisibility(true)}>
                  {deadline.getDate() +
                    "/" +
                    (deadline.getMonth() + 1) +
                    "/" +
                    deadline.getFullYear()}
                </Button>
              </View>
              {Platform.OS === "web" ? (
                <Input
                  style={styles.timeButton}
                  onChangeText={text => setDeadline(new Date(text))}
                  placeholder="MM-DD-YYYY"
                />
              ) : (
                <DateTimePickerModal
                  minimumDate={new Date()}
                  date={deadline}
                  isVisible={startDatelineVisibility}
                  onConfirm={(date: Date) => {
                    setStartDatelineVisibility(false);
                    setDeadline(date);
                  }}
                  onCancel={() => hideTimePicker(setStartDatelineVisibility)}
                />
              )}

              <View id="startday" style={[styles.wrapperSelect]}>
                <View style={styles.wrapperImageText}>
                  <View style={styles.imageWrapper}>
                    <Image source={imgSun} style={styles.icon} />
                  </View>
                  <Text style={styles.text}>Day's start time:</Text>
                </View>
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
              <View id="endday" style={[styles.wrapperSelect, styles.lastSelect]}>
                <View style={styles.wrapperImageText}>
                  <View style={styles.imageWrapper}>
                    <Image source={imgNight} style={styles.icon} />
                  </View>
                  <Text style={styles.text}>Day's end time:</Text>
                </View>
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
              <View style={[styles.wrapperSelectIcon, styles.firstSelect]}>
                <View style={styles.wrapperImageText}>
                  <View style={styles.imageWrapper}>
                    <Image source={imgWolf_Howl} style={styles.icon} />
                  </View>
                  <Text style={styles.text}>Wolf probability: {wolfProb}%</Text>
                </View>
              </View>
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
              <View style={styles.wrapperSelectIcon}>
                <View style={styles.wrapperImageText}>
                  <View style={styles.imageWrapper}>
                    <Image source={imgPotion} style={styles.icon} />
                  </View>
                  <Text style={styles.text}>Contamination probability: {contProb}%</Text>
                </View>
              </View>
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
              <View style={styles.wrapperSelectIcon}>
                <View style={styles.wrapperImageText}>
                  <View style={styles.imageWrapper}>
                    <Image source={imgSeer} style={styles.icon} />
                  </View>
                  <Text style={styles.text}>Seer probability: {seerProb}%</Text>
                </View>
              </View>
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
              <View style={styles.wrapperSelectIcon}>
                <View style={styles.wrapperImageText}>
                  <View style={styles.imageWrapper}>
                    <Image source={imgOwl} style={styles.icon} />
                  </View>
                  <Text style={styles.text}>Insomniac probability: {insomProb}%</Text>
                </View>
              </View>
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
              <View style={styles.wrapperSelectIcon}>
                <View style={styles.wrapperImageText}>
                  <View style={styles.imageWrapper}>
                    <Image source={imgSpirit} style={styles.icon} />
                  </View>
                  <Text style={styles.text}>Spirit probability: {spiritProb}%</Text>
                </View>
              </View>
              <Slider
                thumbStyle={styles.thumbSlider}
                animationType="timing"
                minimumValue={0}
                maximumValue={100}
                onValueChange={setSpiritProb}
                value={spiritProb}
                step={1}
                style={styles.spiritSlider}
              />
              <Button onPress={async () => await newGame()}>Create game</Button>
            </View>
          </ImageBackground>
        </Layout>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: "column",
  },
  container: {
    display: "flex",
    padding: 0,
  },
  viewWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: "10%",
    paddingRight: "10%",
    flex: 1,
    marginTop: "5%",
  },
  wrapperSelect: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  wrapperSelectIcon: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: -10,
    marginTop: 5,
  },
  wrapperImageText: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  imageWrapper: {
    width: 50,
    height: 50,
    marginRight: -10,
  },
  firstSelect: {
    marginTop: 15,
  },
  lastSelect: {
    marginBottom: 20,
  },
  spiritSlider: {
    marginBottom: 5,
  },

  icon: {
    flex: 1,
    resizeMode: "contain",
    width: 30,
    height: 30,
  },
  text: {
    fontWeight: "bold",
    fontSize: 17,
    color: "#fffaf9",
  },
  thumbSlider: {
    height: 15,
    backgroundColor: "#914f49",
    width: 15,
  },
  input: {
    margin: 2,
    width: "40%",
  },
  timeButton: {
    alignSelf: "flex-end",
    width: "40%",
  },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
  },
});

export default NewGame;
