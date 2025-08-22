import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform, 
} from "react-native";
import io from "socket.io-client";
import { BASE_URL } from "../config";

const socket = io(BASE_URL);

export default function ChatScreen({ route }) {
  const { user } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleNewMessage = (msg) => {
      const withTimestamp = {
        ...msg,
        createdAt: msg.createdAt || new Date().toISOString(),
      };
      setMessages((prev) => [...prev, withTimestamp]); // only add backend-confirmed message
    };

    socket.on("message:new", handleNewMessage);

    return () => {
      socket.off("message:new", handleNewMessage);
    };
  }, []);

  const handleSend = () => {
    const msgData = { text: message, to: user._id };
    socket.emit("message:send", msgData); // don't append locally
    setMessage("");
  };

  const renderItem = ({ item }) => {
    const time = item.createdAt
      ? new Date(item.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";
    const isRead = item.readAt ? "✓✓" : "✓";

    return (
      <View
        style={[
          styles.messageBubble,
          item.senderId === user._id ? styles.theirMsg : styles.myMsg,
        ]}
      >
        <Text style={styles.msgText}>{item.text}</Text>
        <Text style={styles.msgMeta}>
          {time} {item.senderId !== user._id && isRead}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // iOS uses padding, Android works better with height
      keyboardVerticalOffset={80} // adjust if header overlaps
    >
      <View style={styles.container}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item._id || Math.random().toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 10 }}
        />
        <View style={styles.inputRow}>
          <TextInput
            placeholder="Type a message"
            value={message}
            onChangeText={setMessage}
            style={styles.input}
          />
          <Button title="Send" onPress={handleSend} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f9f9f9" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 5,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  messageBubble: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 12,
    maxWidth: "75%",
    elevation: 1, // slight shadow
  },
  myMsg: {
    backgroundColor: "#E1F7D5", // soft green (your messages)
    alignSelf: "flex-end",
  },
  theirMsg: {
    backgroundColor: "#ECECEC", // soft grey (other messages)
    alignSelf: "flex-start",
  },
  msgText: {
    fontSize: 16,
    color: "#222", // strong text color
  },
  msgMeta: {
    fontSize: 10,
    color: "gray",
    textAlign: "right",
    marginTop: 4,
  },
});
