import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged, signInWithCredential, GoogleAuthProvider, signInWithEmailAndPassword, signOut } from "firebase/auth";

WebBrowser.maybeCompleteAuthSession();

const googleConfig = Platform.select({
    web: {
        webClientId: "484810036899-09ai4reru5gui6bnpj05kfipnkpamttu.apps.googleusercontent.com",
        redirectUri: makeRedirectUri({ useProxy: true }),
        responseType: "id_token",
        scopes: ["openid", "profile", "email"],
        prompt: "select_account"
    },
    ios: { iosClientId: "", redirectUri: makeRedirectUri({ useProxy: true }) },
    android: { androidClientId: "", redirectUri: makeRedirectUri({ useProxy: true }) },
});


export default function App() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);

    const [request, response, promptAsync] = Google.useAuthRequest(googleConfig);

    useEffect(() => {
        console.log("Auth request ready?", !!request);
    }, [request]);


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
        } else if (response?.type === "error") {
            console.error("Google response error:", response);
            Alert.alert("Gabim", "Google auth dështoi.");
        }
    }, [response]);
    // Email/Password
    const handleEmailLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email.trim(), password);
            Alert.alert("Sukses", "U kyqe me Email!");
        } catch (e) {
            Alert.alert("Gabim", e.message);
        }
    };

    // Shfaq butonin Google vetëm kur ka Client ID për platformën aktuale
    const canUseGoogle =
        (Platform.OS === "web" && !!googleConfig?.web?.webClientId) ||
        (Platform.OS === "ios" && !!googleConfig?.ios?.iosClientId) ||
        (Platform.OS === "android" && !!googleConfig?.android?.androidClientId);

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

            {canUseGoogle && (
                <TouchableOpacity
                    style={[styles.button, styles.googleButton]}
                    onPress={() => promptAsync()}
                    disabled={!request}
                >
                    <Text style={styles.buttonText}>Login me Google</Text>
                </TouchableOpacity>
            )}
            {!canUseGoogle && (
                <Text style={{ marginTop: 10, opacity: 0.8 }}>
                    Vendos Client ID për platformën aktuale për të aktivizuar Google login.
                </Text>
            )}
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
