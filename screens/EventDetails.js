import React, { useEffect, useState } from "react";
import { ImageBackground, View, Text, Image, TouchableOpacity, ScrollView, Linking, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/style";
import { doc, onSnapshot, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { database } from "../firebaseConfig";

const BACKGROUND_IMAGE = require("../assets/background.png");

export default function EventDetails() {
  const route = useRoute();
  const { user } = useAuth();
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [favorited, setFavorited] = useState(false);
  const [participating, setParticipating] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(database, "events", eventId), (docSnap) => {
      if (docSnap.exists()) {
        setEvent(docSnap.data());
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [eventId]);
  
  useEffect(() => {
    if (!user) return;
    const userRef = doc(database, "users", user.uid);

    const checkStatus = async () => {
      try {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setFavorited(userData.favorites?.includes(eventId));
          setParticipating(userData.participations?.includes(eventId));
        }
      } catch (error) {
        console.log("Error checking status:", error);
      }
    };

    checkStatus();
  }, [user, eventId]);
  useEffect(() => {
    if (!eventId) return;
    const fetchParticipantsCount = async () => {
      try {
        const usersSnapshot = await database
          .collection("users")
          .where("participations", "array-contains", eventId)
          .get();
        setParticipantsCount(usersSnapshot.size);
      } catch (error) {
        console.log("Error counting participants:", error);
        setParticipantsCount(0);
      }
    };
    fetchParticipantsCount();
  }, [eventId, participating]);

  const toggleFavorite = async () => {
    if (!user) return;
    const userRef = doc(database, "users", user.uid);
    try {
      if (favorited) {
        await updateDoc(userRef, { favorites: arrayRemove(eventId) });
        setFavorited(false);
      } else {
        await updateDoc(userRef, { favorites: arrayUnion(eventId) });
        setFavorited(true);
      }
    } catch (error) {
      console.log("Error updating favorites:", error);
    }
  };

  const toggleParticipate = async () => {
    if (!user) return;
    const userRef = doc(database, "users", user.uid);
    try {
      if (participating) {
        await updateDoc(userRef, { participations: arrayRemove(eventId) });
        setParticipating(false);
        Alert.alert("Participation removed", "You are no longer participating in this event.");
      } else {
        await updateDoc(userRef, { participations: arrayUnion(eventId) });
        setParticipating(true);
        Alert.alert("Success", "You are now participating in this event!");
      }
    } catch (error) {
      console.log("Error updating participation:", error);
      Alert.alert("Error", "Could not update participation.");
    }
  };

  if (loading || !event) {
    return (
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.background} resizeMode="cover">
        <View style={styles.overlay}>
          <Text style={styles.date}>Loading...</Text>
        </View>
      </ImageBackground>
    );
  }

  const dateObj = event.datetime?.toDate ? event.datetime.toDate() : new Date(event.datetime);
  const date = dateObj.toLocaleDateString();
  const time = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const latitude = event.location?.latitude || event.location?.geopoint?.latitude;
  const longitude = event.location?.longitude || event.location?.geopoint?.longitude;

  return (
    <ImageBackground source={BACKGROUND_IMAGE} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 32 }}>
          <View style={[styles.card, {
            width: "96%",
            maxWidth: 380,
            padding: 24,
            marginTop: 30,
            marginBottom: 30,
            alignItems: "center",
          }]}>
            <Image source={{ uri: event.imageUrl }} style={[styles.image, { height: 220, marginBottom: 18 }]} />
            <Text style={[styles.cardTitle, { fontSize: 26, marginVertical: 10, textAlign: "center" }]}>{event.title}</Text>
            <Text style={[styles.date, { fontSize: 18, marginBottom: 10 }]}>{`${date} ${time}`}</Text>
            <Text style={[styles.eventDescription, { fontSize: 18, marginVertical: 16, textAlign: "center" }]}>{event.description}</Text>
            <Text style={[styles.date, { fontSize: 18, marginBottom: 10 }]}>
              Participants: {participantsCount}
            </Text>
            <Text style={[styles.site, { fontSize: 15, marginVertical: 10, textAlign: "center" }]}>{event.site}</Text>
            
            {latitude && longitude ? (
              <Text
            style={styles.link}
            onPress={() =>
              Linking.openURL(`https://www.google.com/maps?q=${latitude},${longitude}`)
            }
          >
            View on map 📍
          </Text>
            ) : (
              <Text style={styles.date}>Location not informed</Text>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.logout_button,
              { backgroundColor: participating ? "#43a047" : "#2196F3" }
            ]}
            onPress={toggleParticipate}
          >
            <Text style={styles.login_buttonText}>
              {participating ? "Cancel Participation" : "Participate"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.logout_button,
              { backgroundColor: favorited ? "#43a047" : "#2196F3" }
            ]}
            onPress={toggleFavorite}
          >
            <Text style={styles.login_buttonText}>
              {favorited ? "Remove from Favorites" : "Add to Favorites"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}