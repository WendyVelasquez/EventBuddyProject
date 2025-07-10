import React, { useState } from "react";
import { ImageBackground, View, Text, TextInput, TouchableOpacity } from "react-native";
import { signIn } from "../services/firebaseAuth";
import styles from "../styles/style";

const BACKGROUND_IMAGE = require("../assets/background.png");

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");
    setGeneralError("");
    try {
      await signIn(email, password);
    } catch (error) {
      if (error.code === "auth/invalid-email" || error.code === "auth/user-not-found") {
        setEmailError("Invalid email address.");
      } else if (error.code === "auth/wrong-password") {
        setPasswordError("Incorrect password.");
      } else {
        setGeneralError("Login failed. Please try again.");
      }
    }
  };

  return (
    <ImageBackground source={BACKGROUND_IMAGE} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <Text style={styles.header}>Log in to EventBuddy</Text>
        
        <Text style={styles.login_label}>Email address:</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.login_input}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email"
          placeholderTextColor="#eee"
        />
        {emailError ? (
          <Text style={{ color: "#ff4444", marginBottom: 8, marginLeft: 4 }}>{emailError}</Text>
        ) : null}

        <Text style={styles.login_label}>Password:</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.login_input}
          placeholder="Password"
          placeholderTextColor="#eee"
        />
        {passwordError ? (
          <Text style={{ color: "#ff4444", marginBottom: 8, marginLeft: 4 }}>{passwordError}</Text>
        ) : null}

        {generalError ? (
          <Text style={{ color: "#ff4444", marginBottom: 10, textAlign: "center" }}>{generalError}</Text>
        ) : null}

        <TouchableOpacity style={styles.login_button} onPress={handleLogin}>
          <Text style={styles.login_buttonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.login_link}>Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("RecoverPassword")}>
          <Text style={styles.login_link}>I forgot my password</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
