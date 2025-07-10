import React, { useState } from "react";
import { ImageBackground, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import styles from "../styles/style";
import { signUp } from "../services/firebaseAuth";

const BACKGROUND_IMAGE = require("../assets/background.png");

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    try {
      await signUp(email, password);
      Alert.alert("Success", "Account created successfully");
      navigation.navigate("Login");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Error", "That email address is already in use!");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "That email address is invalid!");
      } else {
        Alert.alert("Error", error.message);
      }
    }
  };

  return (
    <ImageBackground source={BACKGROUND_IMAGE} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <Text style={styles.header}>Sign Up</Text>
        <Text style={styles.signup_label}>Email:</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.signup_input}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email"
          placeholderTextColor="#eee"
        />
        <Text style={styles.signup_label}>Password:</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.signup_input}
          placeholder="Password"
          placeholderTextColor="#eee"
        />
        <Text style={styles.signup_label}>Confirm Password:</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.signup_input}
          placeholder="Repeat your password"
          placeholderTextColor="#eee"
        />
        <TouchableOpacity style={styles.signup_button} onPress={handleSignUp}>
          <Text style={styles.signup_buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.login_link}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}