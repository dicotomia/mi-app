import { useState, useEffect, useCallback } from "react";
import { safeStorage } from "../lib/storage";
import { useFocusEffect } from "expo-router";

const PET_VITALITY_KEY = "@dicocat_pet_vitality";

export interface PetVitality {
  steps: number; // Energía
  health: number; // Vitalidad
  sleep: number; // Descanso
  happiness: number; // Felicidad
}

export type PetState =
  | "Agotado"
  | "Hambriento"
  | "Perezoso"
  | "Neutral"
  | "Atleta/Zen";

const DEFAULT_VITALITY: PetVitality = {
  steps: 70,
  health: 70,
  sleep: 70,
  happiness: 70,
};

export function usePetVitality() {
  const [vitality, setVitality] = useState<PetVitality>(DEFAULT_VITALITY);
  const [petState, setPetState] = useState<PetState>("Neutral");

  // Load vitality from storage on focus
  useFocusEffect(
    useCallback(() => {
      const loadVitality = async () => {
        try {
          const savedVitality = await safeStorage.getItem(PET_VITALITY_KEY);
          if (savedVitality) {
            setVitality(JSON.parse(savedVitality));
          }
        } catch (error) {
          console.error("Error loading pet vitality:", error);
        }
      };
      loadVitality();
    }, []),
  );

  // Save vitality to storage whenever it changes
  useEffect(() => {
    const saveVitality = async () => {
      try {
        await safeStorage.setItem(PET_VITALITY_KEY, JSON.stringify(vitality));
      } catch (error) {
        console.error("Error saving pet vitality:", error);
      }
    };
    saveVitality();
  }, [vitality]);

  // Update pet state whenever vitality changes
  useEffect(() => {
    setPetState(getPetState(vitality));
  }, [vitality]);

  const getPetState = (currentVitality: PetVitality): PetState => {
    const { steps, health, sleep, happiness } = currentVitality;

    // Prioridad 1: Agotado
    if (sleep < 20) return "Agotado";
    // Prioridad 2: Hambriento
    if (health < 20) return "Hambriento";
    // Prioridad 3: Perezoso
    if (steps < 20) return "Perezoso";
    // Prioridad 4: Atleta/Zen
    if (steps > 90 && health > 90 && sleep > 90 && happiness > 90)
      return "Atleta/Zen";
    // Prioridad 5: Neutral (si no hay estados críticos y no es Atleta/Zen)
    if (steps > 50 && health > 50 && sleep > 50 && happiness > 50)
      return "Neutral";

    // Default state if none of the above conditions are met
    return "Neutral";
  };

  const updateVitality = (key: keyof PetVitality, value: number) => {
    setVitality((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.min(100, value)), // Ensure value is between 0 and 100
    }));
  };

  const resetVitality = () => {
    setVitality(DEFAULT_VITALITY);
    safeStorage.removeItem(PET_VITALITY_KEY);
  };

  return {
    vitality,
    petState,
    updateVitality,
    resetVitality,
  };
}
