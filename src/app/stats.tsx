import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useOnboarding } from "../hooks/useOnboarding";
import { usePedometer } from "../hooks/usePedometer";
import { getCatStateName, getCompoundState, getFaceImage } from "../lib/cat";

export default function StatsScreen() {
  const { steps } = usePedometer();
  const { profile } = useOnboarding();

  // Calculamos la meta basada en el perfil
  const goal =
    profile?.activityLevel === "sedentary"
      ? 5000
      : profile?.activityLevel === "light"
        ? 7500
        : profile?.activityLevel === "intense"
          ? 12000
          : 10000;

  // Cálculos matemáticos de salud aproximados
  const progress = Math.min((steps / goal) * 100, 100);
  const distance = (steps * 0.000762).toFixed(2); // 1 paso = ~0.762 metros
  const calories = (steps * 0.04).toFixed(0); // 1 paso = ~0.04 kcals

  // Traemos el estado del gato centralizado desde nuestra librería
  const compoundState = getCompoundState(
    steps,
    profile?.sleepHours,
    profile?.lastHobbyDate,
  );

  // Animación de flotación (Idle Animation) para la cara
  const floatAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>📊 Estadísticas</Text>
      <Text style={styles.subtitle}>
        Tu progreso de salud y el de {profile?.catName || "tu gatito"}.
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🐱 Estado Actual</Text>
        <View style={styles.faceContainer}>
          <Animated.View
            style={[
              styles.imageContainer,
              { transform: [{ translateY: floatAnim }] },
            ]}
          >
            <Image
              source={getFaceImage(compoundState)}
              style={styles.bigFaceImage}
              resizeMode="contain"
            />
          </Animated.View>
          <Text style={styles.stateText}>{getCatStateName(compoundState)}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🏆 Progreso Diario</Text>
        <Text style={styles.mainStat}>{steps}</Text>
        <Text style={styles.label}>Pasos completados hoy</Text>

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.percentage}>{progress.toFixed(1)}% de tu meta</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.smallCard}>
          <Text style={styles.icon}>🔥</Text>
          <Text style={styles.statValue}>{calories}</Text>
          <Text style={styles.statLabel}>Kcal quemadas</Text>
        </View>
        <View style={styles.smallCard}>
          <Text style={styles.icon}>📍</Text>
          <Text style={styles.statValue}>{distance}</Text>
          <Text style={styles.statLabel}>Kilómetros</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>💡 Consejo del Día</Text>
        <Text style={styles.tipText}>
          {compoundState.isInsane
            ? `¡${profile?.catName || "Tu mascota"} se siente encerrada! Llévala a hacer un hobby en la zona de exploración.`
            : compoundState.baseState === "alerta"
              ? "¡Necesitamos movernos un poco! Has estado demasiado inactivo."
              : compoundState.baseState === "perezoso"
                ? "¡Levántate del sofá! Sigue siendo sedentario."
                : compoundState.baseState === "neutral"
                  ? `¡Bien hecho! Tienes el nivel mínimo para no tener riesgos de salud.`
                  : "¡Imparable! Tienes un nivel óptimo de protección en tu salud."}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },
  content: { padding: 24, paddingTop: 40, paddingBottom: 40 },
  header: {
    fontSize: 32,
    fontWeight: "900",
    color: "#37474F",
    fontFamily: "monospace",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#37474F",
    fontFamily: "monospace",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "transparent",
    padding: 24,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: "#37474F",
    marginBottom: 20,
    boxShadow: "4px 4px 0px #37474F",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#37474F",
    fontFamily: "monospace",
    textTransform: "uppercase",
    marginBottom: 15,
  },
  faceContainer: {
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
    height: 180,
  },
  imageContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  bigFaceImage: {
    width: "100%",
    height: "100%",
  },
  stateText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#37474F",
    fontFamily: "monospace",
    textTransform: "uppercase",
    textAlign: "center",
  },
  mainStat: {
    fontSize: 40,
    fontWeight: "900",
    color: "#37474F",
    fontFamily: "monospace",
    marginBottom: 5,
  },
  goalText: {
    fontSize: 20,
    color: "#6B7280",
    fontWeight: "600",
    fontFamily: "monospace",
  },
  label: {
    fontSize: 14,
    color: "#374151",
    fontFamily: "monospace",
    marginBottom: 20,
  },
  progressContainer: {
    width: "100%",
    height: 20,
    backgroundColor: "transparent",
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#37474F",
    padding: 4,
    marginBottom: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#37474F",
    borderRadius: 6,
  },
  percentage: {
    fontSize: 14,
    color: "#37474F",
    fontWeight: "900",
    fontFamily: "monospace",
    textAlign: "right",
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 15,
  },
  smallCard: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 20,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: "#37474F",
    alignItems: "center",
    boxShadow: "4px 4px 0px #37474F",
  },
  icon: { fontSize: 32, marginBottom: 10 },
  statValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#37474F",
    fontFamily: "monospace",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#37474F",
    fontWeight: "900",
    fontFamily: "monospace",
    textTransform: "uppercase",
  },
  tipText: {
    fontSize: 14,
    color: "#37474F",
    lineHeight: 24,
    fontFamily: "monospace",
  },
});
