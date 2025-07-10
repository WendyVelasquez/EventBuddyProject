import React, { useEffect, useState } from "react";
import { FlatList, Text, Image, TouchableOpacity } from "react-native";
import { database } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/style";

export default function Events() {
  const [events, setEvents] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = database
      .collection("events")
      .orderBy("datetime")
      .onSnapshot((snapshot) => {
        const eventList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventList);
      });

    return unsubscribe;
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("EventDetails", { eventId: item.id })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.date}>
        {item.datetime
          ? item.datetime.toDate
            ? item.datetime.toDate().toLocaleString()
            : new Date(item.datetime).toLocaleString()
          : "Date not provided"}
      </Text>
      <Text style={styles.location}>📍 {item.location?.name}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
}