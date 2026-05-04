
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Memoria temporal en caso de que el módulo nativo falle en un APK desactualizado
const memoryStorage = new Map<string, string>();

// Utilidad para asegurar compatibilidad con Web y evitar "Native module is null"
export const safeStorage = {
  getItem: async (key: string) => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      return window.localStorage.getItem(key);
    }
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      return memoryStorage.get(key) || null;
    }
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.localStorage.setItem(key, value);
      return;
    }
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      memoryStorage.set(key, value);
    }
  },
  removeItem: async (key: string) => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.localStorage.removeItem(key);
      return;
    }
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      memoryStorage.delete(key);
    }
  },
};
