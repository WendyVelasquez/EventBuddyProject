import React, { useEffect, useState } from "react";
import { View, Text, ImageBackground, TouchableOpacity, Alert, TextInput, Image, ActivityIndicator } from "react-native";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/style";
import { database } from "../firebaseConfig";

const BACKGROUND_IMAGE = require("../assets/background.png");
const DEFAULT_AVATAR = require("../assets/default-avatar.png");

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = database
      .collection("users")
      .doc(user.uid)
      .onSnapshot(
        (doc) => {
          const data = doc.data();
          setProfile(data);
          setName(data?.name || "");
        },
        (error) => {
          Alert.alert("Error", "Could not fetch profile data.");
        }
      );

    return () => unsubscribe();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await database.collection("users").doc(user.uid).update({
        name: name.trim(),
      });
      setProfile((prev) => ({ ...prev, name: name.trim() }));
      Alert.alert("Profile updated!");
    } catch (error) {
      Alert.alert("Error", "Could not update profile.");
    }
    setSaving(false);
  };

  if (!user) {
    return (
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.background} resizeMode="cover">
        <View style={styles.overlay}>
          <Text style={styles.header}>You are not logged in.</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={BACKGROUND_IMAGE} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <Text style={styles.header}>My profile</Text>

        <Image
          source={profile?.profileImage ? { uri: profile.profileImage } : DEFAULT_AVATAR}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            marginBottom: 16,
            borderWidth: 2,
            borderColor: "#2196F3",
          }}
        />

        <Text style={styles.login_label}>Name:</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={[styles.login_input, { marginBottom: 12 }]}
          placeholder="Enter your name"
        />

        <Text style={styles.login_label}>Email:</Text>
        <Text style={styles.login_input}>{user.email}</Text>

        <Text style={styles.login_label}>
          Favorites: {profile?.favorites?.length ?? 0}
        </Text>
        <Text style={styles.login_label}>
          Participations: {profile?.participations?.length ?? 0}
        </Text>

        <View style={{ alignItems: "center", marginTop: 10 }}>
          <TouchableOpacity
            style={[styles.logout_button, { width: 150, marginBottom: 12 }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.login_buttonText}>Save changes</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.logout_button, { width: 150 }]}
            onPress={logout}
          >
            <Text style={styles.login_buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}