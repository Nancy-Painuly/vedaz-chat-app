import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { getUsers } from "../api";

export default function HomeScreen({ navigation }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.log(error.message);
      Alert.alert("Error", "Could not fetch users");
    }
  };

  const handleUserPress = (user) => {
    navigation.navigate("Chat", { user });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleUserPress(item)}
            style={styles.userItem}
          >
            <Text>{item.name}</Text>
            <Text>{item.email}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  userItem: { padding: 15, borderBottomWidth: 1, borderColor: "#ccc" },
});
