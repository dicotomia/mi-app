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
import { CatState, useCatState } from "../hooks/useCatState";
import { useOnboarding } from "../hooks/useOnboarding";
import { usePedometer } from "../hooks/usePedometer";

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

  // Traemos el estado del gato para saber qué cara mostrar
  const catState = useCatState(steps, goal);

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

  const getFaceImage = (stateName: CatState) => {
    switch (stateName) {
      case "fit":
        return require("../../assets/images/black-fit-cara.png");
      case "cardio":
        return require("../../assets/images/black-cardio-cara.png");
      case "paseo":
        // Imagen faltante: Usamos la cara "sedentario" temporalmente
        return require("../../assets/images/black-sedentario-cara.png");
      case "sedentario":
        return require("../../assets/images/black-sedentario-cara.png");
      case "enfermo":
        return require("../../assets/images/black-enfermo-cara.png");
      default:
        return require("../../assets/images/gatogirando.gif");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>📊 Estadísticas</Text>
      <Text style={styles.subtitle}>
        Tu progreso de salud y el de {profile?.catName || "tu gatito"}.
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🐱 Estado Actual</Text>
        <View style={styles.faceContainer}>
          <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
            <Image
              source={getFaceImage(catState)}
              style={styles.bigFaceImage}
            />
          </Animated.View>
          <Text style={styles.stateText}>
            {catState === "fit"
              ? "Mega Fit"
              : catState === "cardio"
                ? "Saludable"
                : catState === "paseo"
                  ? "Tranquilito"
                  : catState === "sedentario"
                    ? "Sedentario"
                    : "Enfermo"}
          </Text>
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
          {progress < 50
            ? `¡Aún tienes mucho día por delante! Un pequeño paseo de 15 minutos hará muy feliz a ${profile?.catName || "tu gatito"}.`
            : progress < 100
              ? `¡Ya casi lo logras! ${profile?.catName || "Tu mascota"} se está poniendo en forma gracias a ti.`
              : `¡Meta alcanzada! ${profile?.catName || "Tu mascota"} está Mega Fit hoy. ¡Sigue así!`}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFB7B2" },
  content: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  header: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1F2937",
    fontFamily: "monospace",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#374151",
    fontFamily: "monospace",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#E2E8F0", // Gris/Azul plástico
    padding: 24,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: "#1F2937",
    marginBottom: 20,
    shadowColor: "#1F2937",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1F2937",
    fontFamily: "monospace",
    textTransform: "uppercase",
    marginBottom: 15,
  },
  faceContainer: {
    alignItems: "center",
    marginBottom: 5,
  },
  bigFaceImage: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginBottom: 15,
  },
  stateText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1F2937",
    fontFamily: "monospace",
    textTransform: "uppercase",
    textAlign: "center",
  },
  mainStat: {
    fontSize: 40,
    fontWeight: "900",
    color: "#1F2937",
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
    backgroundColor: "#1F2937",
    borderRadius: 10,
    padding: 4,
    marginBottom: 10,
  },
  progressBar: { height: "100%", backgroundColor: "#34D399", borderRadius: 4 },
  percentage: {
    fontSize: 14,
    color: "#1F2937",
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
    backgroundColor: "#E2E8F0",
    padding: 20,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#1F2937",
    alignItems: "center",
    shadowColor: "#1F2937",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  icon: { fontSize: 32, marginBottom: 10 },
  statValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1F2937",
    fontFamily: "monospace",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "900",
    fontFamily: "monospace",
    textTransform: "uppercase",
  },
  tipText: {
    fontSize: 14,
    color: "#1F2937",
    lineHeight: 24,
    fontFamily: "monospace",
  },
});
