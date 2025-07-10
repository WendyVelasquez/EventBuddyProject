import React, { useEffect, useState } from "react";
import { ImageBackground, View, Text, FlatList, Image, TouchableOpacity, Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { database } from "../firebaseConfig";
import styles from "../styles/style";

const BACKGROUND_IMAGE = require("../assets/background.png");

export default function HomeScreen() {
  const [events, setEvents] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = database
      .collection("events")
      .orderBy("datetime", "asc")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(data.slice(0, 4));
      });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => {
    const dateObj = item.datetime.toDate();
    const date = dateObj.toLocaleDateString();
    const time = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const latitude = item.location?.latitude || item.location?.geopoint?.latitude;
    const longitude = item.location?.longitude || item.location?.geopoint?.longitude;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("EventDetails", { eventId: item.id })}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.date}>{`${date} ${time}`}</Text>
        <Text style={styles.site}>{item.site}</Text>
        {latitude && longitude ? (
          <Text
            style={styles.link}
            onPress={() =>
              Linking.openURL(`https://www.google.com/maps?q=${latitude},${longitude}`)}>View on map 📍</Text>):(
          <Text style={styles.date}>Location not informed</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground source={BACKGROUND_IMAGE} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <Text style={styles.header}>Upcoming Events</Text>
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      </View>
    </ImageBackground>
  );
}