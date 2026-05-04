import { UserProfile } from "../hooks/useOnboarding";

// 1. TIPOS Y CONSTANTES CENTRALIZADAS
export type CatState =
  | "alerta"
  | "perezoso"
  | "neutral"
  | "energico"
  | "atleta";

export interface CompoundState {
  baseState: CatState;
  isSleeping: boolean;
  isFatigued: boolean;
  isTired: boolean;
  isInsane: boolean; // Falta de hobbies (Cordura baja)
}

export const CAT_STATE_THRESHOLDS = {
  atleta: 11000,
  energico: 7500,
  neutral: 5000,
  perezoso: 2500,
  alerta: 0,
};

export const GOAL_MULTIPLIERS = {
  sedentary: 5000,
  light: 7500,
  moderate: 10000, // Valor por defecto
  intense: 12000,
};

// 2. LÓGICA DE CÁLCULO
export function getGoal(profile: UserProfile | null): number {
  if (profile?.stepGoal) return profile.stepGoal;
  const activityLevel = profile?.activityLevel || "moderate";
  return GOAL_MULTIPLIERS[activityLevel] || GOAL_MULTIPLIERS.moderate;
}

export function getCatState(steps: number): CatState {
  if (steps >= CAT_STATE_THRESHOLDS.atleta) return "atleta";
  if (steps >= CAT_STATE_THRESHOLDS.energico) return "energico";
  if (steps >= CAT_STATE_THRESHOLDS.neutral) return "neutral";
  if (steps >= CAT_STATE_THRESHOLDS.perezoso) return "perezoso";
  return "alerta";
}

// NUEVO: Calcula el estado jerárquico basado en los 3 pilares
export function getCompoundState(
  steps: number,
  sleepHours?: string,
  lastHobbyDate?: number,
  forceSleep: boolean = false,
  sanityPoints: number = 0,
): CompoundState {
  const baseState = getCatState(steps);

  const isFatigued = sleepHours === "less_4";
  const isTired = sleepHours === "less_6";

  // Mecánica de Locura (Cordura): Si tiene menos de 30 pts o pasaron > 24h sin hobbies
  const timeSinceHobby = Date.now() - (lastHobbyDate || 0);
  const isInsane =
    sanityPoints < 30 || !lastHobbyDate || timeSinceHobby > 86400000;

  // Mecánica de Sueño Real: De 00:00 a 05:59 duerme, a menos que ya haya dado 100 pasos
  const currentHour = new Date().getHours();
  const isSleeping =
    forceSleep || (currentHour >= 0 && currentHour < 6 && steps < 100);

  return { baseState, isSleeping, isFatigued, isTired, isInsane };
}

// 3. OBTENCIÓN DE RECURSOS (IMÁGENES Y TEXTOS)
export function getCatImage(state: CompoundState, color: string = "black") {
  if (state.isSleeping) {
    return require("../../assets/images/negro/durmiendo.png");
  }

  switch (state.baseState) {
    case "atleta":
      return require("../../assets/images/negro/atleta.png");
    case "energico":
      return require("../../assets/images/negro/energetico.png");
    case "neutral":
      return require("../../assets/images/negro/neutral.png");
    case "perezoso":
      return require("../../assets/images/negro/perezoso.png");
    case "alerta":
      return require("../../assets/images/negro/alerta.png");
    default:
      return require("../../assets/images/gatogirando.gif");
  }
}

export function getFaceImage(state: CompoundState) {
  if (state.isSleeping) {
    return require("../../assets/images/negro/estado_durmiendo.png");
  }

  switch (state.baseState) {
    case "atleta":
      return require("../../assets/images/negro/estado_atleta.png");
    case "energico":
      return require("../../assets/images/negro/estado_energico.png");
    case "neutral":
      return require("../../assets/images/negro/estado_neutral.png");
    case "perezoso":
      return require("../../assets/images/negro/estado_perezoso.png");
    case "alerta":
      return require("../../assets/images/negro/estado_alerta.png");
    default:
      return require("../../assets/images/gatogirando.gif");
  }
}

export function getCatStateName(state: CompoundState): string {
  if (state.isSleeping) return "DURMIENDO Zzz...";

  let name = "";
  switch (state.baseState) {
    case "atleta":
      name = "ATLÉTICO";
      break;
    case "energico":
      name = "ACTIVO";
      break;
    case "neutral":
      name = "NEUTRAL";
      break;
    case "perezoso":
      name = "PEREZOSO";
      break;
    case "alerta":
      name = "CRÍTICO";
      break;
    default:
      name = "DESCONOCIDO";
      break;
  }

  if (state.isInsane) name += " [LOCURA]";
  if (state.isFatigued || state.isTired) name += " [CANSADO]";
  return name;
}
