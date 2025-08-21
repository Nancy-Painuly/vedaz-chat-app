import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import { loginUser } from "../api";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await loginUser({ email, password });
      Alert.alert("Success", "Logged in!");
      navigation.navigate("Home");
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert("Error", "Login failed");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Text onPress={() => navigation.navigate("Register")} style={styles.link}>
        Don't have an account? Register
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 },
  link: { marginTop: 10, color: "blue", textAlign: "center" },
});
