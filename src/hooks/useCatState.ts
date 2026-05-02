import { useMemo } from "react";

// Definimos los 5 estados posibles de nuestro gatito
export type CatState = "enfermo" | "sedentario" | "paseo" | "cardio" | "fit";

export function useCatState(steps: number, goal: number): CatState {
  // useMemo hace que el estado solo se recalcule cuando los pasos o la meta cambien
  return useMemo(() => {
    if (steps >= 12000) return "fit"; // 12000 pasos o más
    if (steps >= 8000) return "cardio"; // De 8000 a 11999 pasos
    if (steps >= 4000) return "paseo"; // De 4000 a 7999 pasos
    if (steps >= 1000) return "sedentario"; // De 1000 a 3999 pasos

    return "enfermo"; // De 0 a 999 pasos
  }, [steps, goal]);
}
