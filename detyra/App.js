// App.js
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import { auth } from "./firebaseConfig";
import { Platform } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import {
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,
    signInWithCredential,
    GoogleAuthProvider,
} from "firebase/auth";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);

    // Vendos webClientId nga Google Cloud Console (OAuth 2.0 Client IDs -> Web)
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: "GOOGLE_WEB_CLIENT_ID",
        redirectUri: makeRedirectUri({ useProxy: true }),
    });

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return unsub;
    }, []);

    useEffect(() => {
        if (response?.type === "success") {
            const { id_token } = response.params;
            const cred = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, cred)
                .then(() => Alert.alert("Sukses", "U kyqe me Google!"))
                .catch((e) => Alert.alert("Gabim", e.message));
        }
    }, [response]);

    const handleEmailLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email.trim(), password);
            Alert.alert("Sukses", "U kyqe me Email!");
        } catch (e) {
            Alert.alert("Gabim", e.message);
        }
    };

    if (user) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Mirë se erdhe 👋</Text>
                <Text style={{ marginBottom: 16 }}>{user.email ?? user.displayName}</Text>
                <TouchableOpacity style={[styles.button, { backgroundColor: "#444" }]} onPress={() => signOut(auth)}>
                    <Text style={styles.buttonText}>Dil (Sign out)</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>TechVision Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleEmailLogin}>
                <Text style={styles.buttonText}>Login me Email</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.googleButton]}
                onPress={() => promptAsync()}
                disabled={!request}
            >
                <Text style={styles.buttonText}>Login me Google</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
    title: { fontSize: 26, fontWeight: "bold", marginBottom: 24 },
    input: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12, marginBottom: 12 },
    button: { width: "100%", backgroundColor: "#1e90ff", padding: 14, borderRadius: 10, alignItems: "center", marginTop: 8 },
    googleButton: { backgroundColor: "#db4437" },
    buttonText: { color: "#fff", fontWeight: "700" },
});
