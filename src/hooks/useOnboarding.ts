import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Platform } from "react-native";

const ONBOARDING_KEY = "@dicocat_onboarding_completed";
const USER_PROFILE_KEY = "@dicocat_user_profile";

// Memoria temporal en caso de que el módulo nativo falle en un APK desactualizado
const memoryStorage = new Map<string, string>();

// Utilidad para asegurar compatibilidad con Web y evitar "Native module is null"
const safeStorage = {
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

export interface UserProfile {
  activityLevel: "sedentary" | "light" | "moderate" | "intense";
  sleepHours: string;
  smoker: boolean;
  catName?: string;
  catColor?: "orange" | "black" | "white";
}

export function useOnboarding() {
  const [isCompleted, setIsCompleted] = useState<boolean | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Recargar perfil de la memoria al cambiar de pestaña
  useFocusEffect(
    useCallback(() => {
      const checkOnboarding = async () => {
        try {
          const completed = await safeStorage.getItem(ONBOARDING_KEY);
          const savedProfile = await safeStorage.getItem(USER_PROFILE_KEY);

          setIsCompleted(completed === "true");
          if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
          }
        } catch (error) {
          console.log("Error leyendo Storage en useOnboarding:", error);
          setIsCompleted(false);
        }
      };
      checkOnboarding();
    }, []),
  );

  const completeOnboarding = async (newProfile: UserProfile) => {
    try {
      await safeStorage.setItem(USER_PROFILE_KEY, JSON.stringify(newProfile));
      await safeStorage.setItem(ONBOARDING_KEY, "true");
      setProfile(newProfile);
      setIsCompleted(true);
    } catch (error) {
      console.log("Error guardando en Storage:", error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    const updated = { ...profile, ...updates };
    try {
      await safeStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updated));
      setProfile(updated);
    } catch (error) {
      console.log("Error actualizando Storage:", error);
    }
  };

  const resetProfile = async () => {
    try {
      await safeStorage.removeItem(ONBOARDING_KEY);
      await safeStorage.removeItem(USER_PROFILE_KEY);
      setIsCompleted(false);
      setProfile(null);
    } catch (error) {
      console.log("Error borrando Storage:", error);
    }
  };

  return {
    isCompleted,
    profile,
    completeOnboarding,
    updateProfile,
    resetProfile,
  };
}
