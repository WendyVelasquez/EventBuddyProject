import React, { useState } from "react";
import { ImageBackground, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import styles from "../styles/style";
import { auth } from "../firebaseConfig";
const BACKGROUND_IMAGE = require("../assets/background.png");

export default function RecoveryScreen({ navigation }) {
  const [email, setEmail] = useState("");

  const handleRecovery = async () => {
    if (!email.trim()) {
      Alert.alert("Erro", "Enter account email.");
      return;
    }
    try {
      await auth.sendPasswordResetEmail(email);
      Alert.alert("Success", "Recovery email sent!");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Erro", "Invalid email. Try again.");
      console.log(error);
    }
  };

  return (
    <ImageBackground source={BACKGROUND_IMAGE} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <Text style={styles.header}>Password recovery</Text>
        <Text style={styles.login_label}>Email:</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.login_input}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email"
          placeholderTextColor="#eee"
        />
        <TouchableOpacity style={styles.login_button} onPress={handleRecovery}>
          <Text style={styles.login_buttonText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.login_link}>Create a free account</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.login_link}>Back</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}