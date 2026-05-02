import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CatState, useCatState } from "../hooks/useCatState";
import { useOnboarding, UserProfile } from "../hooks/useOnboarding";
import { usePedometer } from "../hooks/usePedometer";

export default function HomeScreen() {
  const { isCompleted, profile, completeOnboarding, resetProfile } =
    useOnboarding();
  const { steps, addSimulatedSteps, resetSteps } = usePedometer();

  // Estado para controlar la pantalla de carga (Splash Screen) con GIF
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3500); // El GIF se mostrará por 3.5 segundos
    return () => clearTimeout(timer);
  }, []);

  // Animación de flotación (Idle Animation) para el gato
  const floatAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  // Estado temporal para el cuestionario
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [tempProfile, setTempProfile] = useState<Partial<UserProfile>>({});

  // Meta dinámica basada en el perfil
  const goal =
    profile?.activityLevel === "sedentary"
      ? 5000
      : profile?.activityLevel === "light"
        ? 7500
        : profile?.activityLevel === "intense"
          ? 12000
          : 10000;

  // Calculamos el estado del gato basado en los pasos simulados
  const catState = useCatState(steps, goal);
  const progressPercentage = Math.min((steps / goal) * 100, 100);

  // Lógica para la imagen animada del gato basado en color y estado
  const getCatImage = () => {
    const color = profile?.catColor || "orange";

    // Por ahora usamos las imágenes del gato negro para todos los colores
    // para que puedas ver los cambios de estado sin importar el color elegido.
    switch (catState) {
      case "fit":
        return require("../../assets/images/black-fit.png"); // Más de 9000 pasos
      case "cardio":
        return require("../../assets/images/black-cardio.png"); // 8000 a 8999 pasos
      case "paseo":
        return require("../../assets/images/black-paseo.png"); // 4000 a 7999 pasos
      case "sedentario":
        return require("../../assets/images/black-sedentario.png"); // 1000 a 3999 pasos
      case "enfermo":
        return require("../../assets/images/black-enfermo.png"); // 0 a 999 pasos
      default:
        return require("../../assets/images/gatogirando.gif");
    }
  };

  // Lógica para las imágenes de las caras en la sección de Salud
  const getFaceImage = (stateName: CatState) => {
    // NOTA: He puesto el sufijo "-cara.png". Cambia esto por el nombre exacto de tus archivos
    switch (stateName) {
      case "fit":
        return require("../../assets/images/black-fit-cara.png");
      case "cardio":
        return require("../../assets/images/black-cardio-cara.png");
      case "paseo":
        // Imagen faltante: Usamos la cara "sedentario" temporalmente para que la app no dé error.
        return require("../../assets/images/black-sedentario-cara.png");
      case "sedentario":
        return require("../../assets/images/black-sedentario-cara.png");
      case "enfermo":
        return require("../../assets/images/black-enfermo-cara.png");
      default:
        return require("../../assets/images/gatogirando.gif");
    }
  };

  // Flujo de Onboarding (Cuestionario de Salud)
  if (!isCompleted) {
    const handleActivitySelect = (level: UserProfile["activityLevel"]) => {
      setTempProfile({ ...tempProfile, activityLevel: level });
      setOnboardingStep(1);
    };

    const handleSleepSelect = (hours: string) => {
      setTempProfile({ ...tempProfile, sleepHours: hours });
      setOnboardingStep(2);
    };

    const handleHabitsSelect = (smoker: boolean) => {
      setTempProfile({ ...tempProfile, smoker, catColor: "orange" });
      setOnboardingStep(3); // Vamos al último paso: El Gato
    };

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.onboardingCard}>
          {onboardingStep === 0 && (
            <>
              <Text style={{ fontSize: 80, marginBottom: 10 }}>👋</Text>
              <Text style={styles.title}>¡Hola!</Text>
              <Text style={styles.subtitle}>
                ¿Cuál es tu nivel de actividad física actual?
              </Text>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleActivitySelect("sedentary")}
              >
                <Text style={styles.optionText}>
                  🛋️ Sedentario (Casi no me muevo)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleActivitySelect("light")}
              >
                <Text style={styles.optionText}>
                  🚶 Ligero (Camino un poco)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleActivitySelect("moderate")}
              >
                <Text style={styles.optionText}>
                  🏃 Moderado (Hago ejercicio regular)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleActivitySelect("intense")}
              >
                <Text style={styles.optionText}>
                  🔥 Intenso (Entreno a diario)
                </Text>
              </TouchableOpacity>
            </>
          )}

          {onboardingStep === 1 && (
            <>
              <Text style={{ fontSize: 80, marginBottom: 10 }}>💤</Text>
              <Text style={styles.title}>Descanso</Text>
              <Text style={styles.subtitle}>
                ¿Cuántas horas duermes en promedio?
              </Text>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleSleepSelect("less_6")}
              >
                <Text style={styles.optionText}>Menos de 6 horas 🥱</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleSleepSelect("6_8")}
              >
                <Text style={styles.optionText}>Entre 6 y 8 horas 😌</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleSleepSelect("more_8")}
              >
                <Text style={styles.optionText}>Más de 8 horas 😴</Text>
              </TouchableOpacity>
            </>
          )}

          {onboardingStep === 2 && (
            <>
              <Text style={{ fontSize: 80, marginBottom: 10 }}>🚭</Text>
              <Text style={styles.title}>Hábitos</Text>
              <Text style={styles.subtitle}>¿Fumas actualmente?</Text>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleHabitsSelect(false)}
              >
                <Text style={styles.optionText}>No, soy libre de humo 🌿</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButtonWarning}
                onPress={() => handleHabitsSelect(true)}
              >
                <Text style={styles.optionTextWarning}>Sí, fumo 🚬</Text>
              </TouchableOpacity>
            </>
          )}

          {onboardingStep === 3 && (
            <>
              <Text style={{ fontSize: 80, marginBottom: 10 }}>🐾</Text>
              <Text style={styles.title}>Tu Mascota</Text>
              <Text style={styles.subtitle}>Dale un nombre y color</Text>

              <TextInput
                style={styles.input}
                placeholder="Ej: Michi..."
                value={tempProfile.catName || ""}
                onChangeText={(text) =>
                  setTempProfile({ ...tempProfile, catName: text })
                }
                maxLength={15}
              />

              <View style={styles.colorRow}>
                <TouchableOpacity
                  style={[
                    styles.colorBox,
                    tempProfile.catColor === "orange" && styles.colorBoxActive,
                  ]}
                  onPress={() =>
                    setTempProfile({ ...tempProfile, catColor: "orange" })
                  }
                >
                  <Text style={styles.emoji}>🐈</Text>
                  <Text style={styles.colorName}>Naranja</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.colorBox,
                    tempProfile.catColor === "black" && styles.colorBoxActive,
                  ]}
                  onPress={() =>
                    setTempProfile({ ...tempProfile, catColor: "black" })
                  }
                >
                  <Text style={styles.emoji}>🐈‍⬛</Text>
                  <Text style={styles.colorName}>Negro</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.colorBox,
                    tempProfile.catColor === "white" && styles.colorBoxActive,
                  ]}
                  onPress={() =>
                    setTempProfile({ ...tempProfile, catColor: "white" })
                  }
                >
                  <Text style={styles.emoji}>🐱</Text>
                  <Text style={styles.colorName}>Blanco</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  { marginTop: 20, backgroundColor: "#34D399" },
                ]}
                onPress={() => {
                  completeOnboarding({
                    ...tempProfile,
                    catName: tempProfile.catName || "Gatito",
                    catColor: tempProfile.catColor || "orange",
                  } as UserProfile);
                }}
              >
                <Text style={styles.optionText}>¡Comenzar! 🚀</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    );
  }

  // Dashboard Principal
  return (
    <View style={styles.dashboardContainer}>
      <View style={styles.card}>
        <Text style={styles.catName}>
          - {profile?.catName || "TU GATITO"} -
        </Text>

        <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
          <Image source={getCatImage()} style={styles.catImage} />
        </Animated.View>

        <Text style={styles.state}>
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

        {/* Barra de Progreso */}
        <View style={styles.progressContainer}>
          <View
            style={[styles.progressBar, { width: `${progressPercentage}%` }]}
          />
        </View>

        <Text style={styles.steps}>PUNTOS: {steps}</Text>
      </View>

      {/* NUEVO APARTADO DE SALUD */}
      <View style={styles.healthSection}>
        <Text style={styles.healthTitle}>Nivel de Salud</Text>
        <View style={styles.facesRow}>
          {(
            ["enfermo", "sedentario", "paseo", "cardio", "fit"] as CatState[]
          ).map((state) => (
            <View
              key={state}
              style={[
                styles.faceContainer,
                catState === state && styles.activeFaceContainer,
              ]}
            >
              <Image
                source={getFaceImage(state)}
                style={[
                  styles.faceImage,
                  catState !== state && styles.inactiveFace,
                ]}
              />
            </View>
          ))}
        </View>
      </View>

      {/* BOTONES DE DESARROLLADOR SUTILES */}
      <View style={styles.debugContainer}>
        <Text style={styles.debugTitle}>-- dev tools --</Text>
        <View style={styles.debugButtonsRow}>
          <TouchableOpacity
            style={styles.debugButton}
            onPress={() => addSimulatedSteps(1000)}
          >
            <Text style={styles.debugButtonText}>+1000 Pts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.debugButton} onPress={resetSteps}>
            <Text style={styles.debugButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFB7B2", // Color de carcasa Tamagotchi (Rosa Pastel)
  },
  content: {
    alignItems: "center",
    padding: 24,
    paddingTop: 60, // Más espacio arriba
    paddingBottom: 40, // Espacio extra abajo para que no lo tapen las pestañas
  },
  dashboardContainer: {
    flex: 1,
    backgroundColor: "#FFB7B2",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  subtitle: {
    fontSize: 18,
    color: "#374151",
    fontFamily: "monospace",
    marginBottom: 30,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#96CDC3", // Color de Pantalla LCD clásica
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 6, // Borde ajustado
    borderColor: "#1F2937",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
    shadowColor: "#1F2937",
    shadowOffset: { width: 6, height: 6 }, // Sombra ajustada
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  catName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    fontFamily: "monospace",
    textTransform: "uppercase",
    marginBottom: 10,
    letterSpacing: 2,
  },
  catImage: {
    width: 190, // Imagen ajustada para que quepa en pantalla
    height: 190,
    marginBottom: 15,
    resizeMode: "contain",
  },
  state: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1F2937",
    fontFamily: "monospace",
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 15,
    backgroundColor: "#FDE047", // Etiqueta amarilla de estado
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#1F2937",
  },
  progressContainer: {
    width: "100%",
    height: 20,
    backgroundColor: "#1F2937", // Borde negro para la barra
    borderRadius: 10,
    padding: 4,
    marginBottom: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#34D399", // Verde vibrante digital
    borderRadius: 4,
  },
  steps: {
    fontSize: 20,
    color: "#1F2937",
    fontWeight: "900",
    fontFamily: "monospace",
  },

  // Estilos sutiles para Dev Tools
  debugContainer: {
    marginTop: 30,
    alignItems: "center",
    width: "100%",
  },
  debugTitle: {
    fontFamily: "monospace",
    color: "#9CA3AF",
    fontSize: 10,
    marginBottom: 5,
  },
  debugButtonsRow: {
    flexDirection: "row",
    gap: 15,
  },
  debugButton: {
    padding: 8,
  },
  debugButtonText: {
    color: "#6B7280",
    fontFamily: "monospace",
    fontSize: 12,
  },

  // Estilos de la sección de Salud (Timeline)
  healthSection: {
    marginTop: 10,
    backgroundColor: "#E2E8F0",
    padding: 15,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: "#1F2937",
    width: "100%",
    shadowColor: "#1F2937",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  healthTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#1F2937",
    fontFamily: "monospace",
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 15,
  },
  facesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faceContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  activeFaceContainer: {
    borderColor: "#1F2937",
    backgroundColor: "#FDE047", // Amarillo para destacar el actual
  },
  faceImage: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
  inactiveFace: {
    opacity: 0.3, // Opaca las caras que no son el estado actual
  },

  // Estilos del Onboarding
  onboardingCard: {
    backgroundColor: "#FFF",
    padding: 30,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: "#1F2937",
    alignItems: "center",
    width: "100%",
    shadowColor: "#1F2937",
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  optionButton: {
    backgroundColor: "#E0E7FF",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#1F2937",
    width: "100%",
    marginBottom: 12,
  },
  optionText: {
    color: "#1F2937",
    fontWeight: "900",
    fontSize: 14,
    fontFamily: "monospace",
    textAlign: "center",
  },
  optionButtonWarning: {
    backgroundColor: "#FECACA",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#1F2937",
    width: "100%",
    marginBottom: 12,
  },
  optionTextWarning: {
    color: "#1F2937",
    fontWeight: "900",
    fontSize: 14,
    fontFamily: "monospace",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#1F2937",
    padding: 15,
    fontSize: 16,
    fontFamily: "monospace",
    marginBottom: 20,
    color: "#111827",
    width: "100%",
  },
  colorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    width: "100%",
  },
  colorBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#1F2937",
  },
  colorBoxActive: { backgroundColor: "#FDE047" },
  emoji: { fontSize: 32, marginBottom: 5 },
  colorName: {
    fontSize: 10,
    fontWeight: "900",
    color: "#1F2937",
    fontFamily: "monospace",
    textTransform: "uppercase",
  },
});
