import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import type { Storage } from "redux-persist";

const noopStorage: Storage = {
    getItem: async () => null,
    setItem: async () => undefined,
    removeItem: async () => undefined,
};

const webStorage: Storage = {
    getItem: async (key) => {
        if (typeof window === "undefined") return null;
        return window.localStorage.getItem(key);
    },
    setItem: async (key, value) => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(key, value);
    },
    removeItem: async (key) => {
        if (typeof window === "undefined") return;
        window.localStorage.removeItem(key);
    },
};

export const persistStorage: Storage =
    Platform.OS === "web" ? webStorage : AsyncStorage ?? noopStorage;
