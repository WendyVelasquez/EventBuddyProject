import React, { useEffect, useState } from "react";
import { ImageBackground, View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { database } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/style";

const BACKGROUND_IMAGE = require("../assets/background.png");

export default function FavoritesScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = database
      .collection("users")
      .doc(user.uid)
      .onSnapshot(async (doc) => {
        const favIds = doc.data()?.favorites || [];
        if (!favIds.length) {
          setFavorites([]);
          setLoading(false);
          return;
        }
        setLoading(true);
        try {
          const eventsSnapshot = await database
            .collection("events")
            .where("__name__", "in", favIds.slice(0, 10))
            .get();

          const events = eventsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFavorites(events);
        } catch (error) {
          console.log("Error fetching favorites:", error);
        } finally {
          setLoading(false);
        }
      });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.background} resizeMode="cover">
        <View style={styles.overlay}>
          <Text style={styles.header}>Upcoming Events</Text>
        </View>
      </ImageBackground>
    );
  }

  if (favorites.length === 0) {
    return (
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.background} resizeMode="cover">
        <View style={styles.overlay}>
          <Text style={styles.header}>You don't have any favorite events yet!</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={BACKGROUND_IMAGE} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <Text style={styles.header}>Favorites</Text>
        <FlatList
          data={favorites}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate("Home", {
                  screen: "EventDetails",
                  params: { eventId: item.id }
                })
              }
            >
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.date}>
                {item.datetime?.toDate ? item.datetime.toDate().toLocaleString() : ""}
              </Text>
              <Text style={styles.site}>{item.site}</Text>
              <Text
                style={styles.link}
                onPress={() =>
              Linking.openURL(`https://www.google.com/maps?q=${latitude},${longitude}`)
            }
          >
            View on map 📍
          </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ImageBackground>
  );
}
