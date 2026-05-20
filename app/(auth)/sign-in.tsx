import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const DEMO_ID = "lumiere";
const DEMO_PASSWORD = "shop1234";

export default function SignIn() {
  const [userId, setUserId] = useState(DEMO_ID);
  const [password, setPassword] = useState(DEMO_PASSWORD);

  const handleSignIn = () => {
    if (userId.trim() === DEMO_ID && password === DEMO_PASSWORD) {
      router.replace("/");
      return;
    }

    Alert.alert("Invalid login", `Use ID "${DEMO_ID}" and password "${DEMO_PASSWORD}".`);
  };

  return (
    <SafeAreaView className="flex-1 bg-stone-50 px-5 pt-8">
      <View className="mb-10 items-center">
        <Text className="font-sans-extrabold text-[38px] italic tracking-wide text-amber-600">Lumiere</Text>
        <Text className="mt-2 text-center font-sans-medium text-zinc-400">Sign in to manage your wishlist and preferences.</Text>
      </View>

      <View className="rounded-3xl border border-stone-100 bg-white p-5">
        <Text className="mb-4 text-2xl font-sans-extrabold text-zinc-900">Welcome back</Text>

        <View className="mb-4 gap-2">
          <Text className="text-sm font-sans-bold text-zinc-700">User ID</Text>
          <TextInput
            value={userId}
            onChangeText={setUserId}
            autoCapitalize="none"
            className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 font-sans-medium text-zinc-900"
            placeholder="Enter user ID"
          />
        </View>

        <View className="mb-5 gap-2">
          <Text className="text-sm font-sans-bold text-zinc-700">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 font-sans-medium text-zinc-900"
            placeholder="Enter password"
          />
        </View>

        <Pressable className="h-12 flex-row items-center justify-center gap-2 rounded-2xl bg-amber-500" onPress={handleSignIn}>
          <Ionicons name="log-in-outline" size={18} color="#fff" />
          <Text className="font-sans-bold text-white">Sign in</Text>
        </Pressable>

        <View className="mt-4 rounded-2xl bg-amber-50 p-3">
          <Text className="text-xs font-sans-bold text-amber-700">Demo ID: {DEMO_ID}</Text>
          <Text className="mt-1 text-xs font-sans-bold text-amber-700">Demo password: {DEMO_PASSWORD}</Text>
        </View>
      </View>

      {/* <View className="mt-6 flex-row justify-center gap-1">
        <Text className="font-sans-medium text-zinc-400">Need an account?</Text>
        <Link href="/(auth)/sign-up" className="font-sans-bold text-amber-600">Create one</Link>
      </View> */}
    </SafeAreaView>
  );
}
