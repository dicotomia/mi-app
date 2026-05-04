import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { safeStorage } from "../lib/storage";

const ONBOARDING_KEY = "@dicocat_onboarding_completed";
const USER_PROFILE_KEY = "@dicocat_user_profile";

export interface UserProfile {
  activityLevel: "sedentary" | "light" | "moderate" | "intense";
  sleepHours: "less_4" | "less_6" | "6_8" | "more_8";
  smoker: boolean;
  catName?: string;
  catColor?: "orange" | "black" | "white";
  stepGoal?: number; // Meta de pasos personalizada
  lastHobbyDate?: number; // Timestamp del último hobby realizado
  sanityPoints?: number; // Puntos de Cordura / Salud Mental (0 a 100)
  forceSleep?: boolean; // Modo desarrollador para forzar sueño
}

// Estado global en memoria para sincronizar múltiples componentes
let globalIsCompleted: boolean | null = null;
let globalProfile: UserProfile | null = null;
const listeners = new Set<() => void>();

const notifyListeners = () => listeners.forEach((listener) => listener());

export function useOnboarding() {
  const [isCompleted, setIsCompleted] = useState<boolean | null>(
    globalIsCompleted,
  );
  const [profile, setProfile] = useState<UserProfile | null>(globalProfile);

  useEffect(() => {
    const listener = () => {
      setIsCompleted(globalIsCompleted);
      setProfile(globalProfile);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  // Recargar perfil de la memoria al cambiar de pestaña
  useFocusEffect(
    useCallback(() => {
      const checkOnboarding = async () => {
        try {
          const completed = await safeStorage.getItem(ONBOARDING_KEY);
          const savedProfile = await safeStorage.getItem(USER_PROFILE_KEY);

          globalIsCompleted = completed === "true";
          if (savedProfile) {
            globalProfile = JSON.parse(savedProfile);
          }
          notifyListeners();
        } catch (error) {
          console.log("Error leyendo Storage en useOnboarding:", error);
          globalIsCompleted = false;
          notifyListeners();
        }
      };
      checkOnboarding();
    }, []),
  );

  const completeOnboarding = async (newProfile: UserProfile) => {
    try {
      await safeStorage.setItem(USER_PROFILE_KEY, JSON.stringify(newProfile));
      await safeStorage.setItem(ONBOARDING_KEY, "true");
      globalProfile = newProfile;
      globalIsCompleted = true;
      notifyListeners();
    } catch (error) {
      console.log("Error guardando en Storage:", error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!globalProfile) return;
    const updated = { ...globalProfile, ...updates };
    try {
      await safeStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updated));
      globalProfile = updated;
      notifyListeners();
    } catch (error) {
      console.log("Error actualizando Storage:", error);
    }
  };

  const resetProfile = async () => {
    try {
      await safeStorage.removeItem(ONBOARDING_KEY);
      await safeStorage.removeItem(USER_PROFILE_KEY);
      globalIsCompleted = false;
      globalProfile = null;
      notifyListeners();
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
