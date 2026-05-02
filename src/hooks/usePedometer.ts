import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Platform } from "react-native";

const STEPS_KEY = "@dicocat_steps_today";

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

export function usePedometer() {
  // Mantenemos el estado desactivado ya que eliminamos el código nativo
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [steps, setSteps] = useState(0);

  // Recargar los pasos de la memoria CADA VEZ que se entra a una pestaña
  useFocusEffect(
    useCallback(() => {
      const loadSteps = async () => {
        try {
          const savedSteps = await safeStorage.getItem(STEPS_KEY);
          if (savedSteps !== null) {
            setSteps(parseInt(savedSteps, 10));
          }
        } catch (error) {
          console.log("Error leyendo pasos de Storage:", error);
        }
      };
      loadSteps();
    }, []),
  );

  // Función de ayuda para simular pasos pulsando un botón temporal en la UI
  const addSimulatedSteps = (amount: number) => {
    setSteps((prev) => {
      const newSteps = prev + amount;
      // Guardamos en memoria capturando posibles errores
      safeStorage.setItem(STEPS_KEY, newSteps.toString()).catch((error) => {
        console.log("Error guardando pasos:", error);
      });
      return newSteps;
    });
  };

  // Función para reiniciar los pasos a 0 (muy útil para pruebas)
  const resetSteps = () => {
    setSteps(0);
    safeStorage.removeItem(STEPS_KEY).catch((error) => {
      console.log("Error borrando pasos:", error);
    });
  };

  return {
    isAvailable,
    steps,
    addSimulatedSteps,
    resetSteps,
  };
}
