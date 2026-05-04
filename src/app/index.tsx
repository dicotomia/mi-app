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
import { useOnboarding, UserProfile } from "../hooks/useOnboarding";
import { usePedometer } from "../hooks/usePedometer";
import {
  getCatImage,
  getCatStateName,
  getCompoundState,
  getGoal,
} from "../lib/cat";

export default function HomeScreen() {
  const { isCompleted, profile, completeOnboarding } = useOnboarding();
  const { steps: pedometerSteps } = usePedometer();

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

  // Animación de fuego al pasar los 12000 pasos
  const fireAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (pedometerSteps >= 12000) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fireAnim, {
            toValue: 1.4,
            duration: 350,
            useNativeDriver: true,
          }),
          Animated.timing(fireAnim, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [pedometerSteps]);

  // Estado temporal para el cuestionario
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [tempProfile, setTempProfile] = useState<Partial<UserProfile>>({});
  const [customGoal, setCustomGoal] = useState("10000");

  // Lógica de la app centralizada en el módulo `cat.ts`
  const goal = getGoal(profile);
  const compoundState = getCompoundState(
    pedometerSteps,
    profile?.sleepHours,
    profile?.lastHobbyDate,
    profile?.forceSleep || false,
    profile?.sanityPoints || 0,
  );

  // La barra escala hasta 12000 (OMS) o la meta del usuario si es mayor
  const maxLimit = Math.max(12000, goal);
  const progressPercentage = Math.min((pedometerSteps / maxLimit) * 100, 100);
  const markerPositionPercentage = Math.min((goal / maxLimit) * 100, 100);

  // Flujo de Onboarding (Cuestionario de Salud)
  if (!isCompleted) {
    const handleNameSubmit = () => {
      if (!tempProfile.catName) {
        setTempProfile({ ...tempProfile, catName: "Gatito" });
      }
      setOnboardingStep(1);
    };

    const handleActivitySelect = (level: UserProfile["activityLevel"]) => {
      setTempProfile({ ...tempProfile, activityLevel: level });
      setOnboardingStep(2);
    };

    const handleGoalSubmit = () => {
      setTempProfile({
        ...tempProfile,
        stepGoal: parseInt(customGoal) || 10000,
      });
      setOnboardingStep(3);
    };

    const handleSleepSelect = (
      hours: "less_4" | "less_6" | "6_8" | "more_8",
    ) => {
      completeOnboarding({
        ...tempProfile,
        sleepHours: hours,
        catColor: "black", // Eliminamos colores por ahora
        smoker: false,
      } as UserProfile);
    };

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.onboardingContainer}
      >
        <View style={styles.onboardingCard}>
          {onboardingStep === 0 && (
            <>
              <Image
                source={require("../../assets/images/negro/estado_atleta.png")}
                style={styles.onboardingImage}
                resizeMode="contain"
              />

              <Text style={styles.onboardingSubtitle}>
                Nombre de tu mascota:
              </Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.onboardingInput, { flex: 1, marginBottom: 0 }]}
                  placeholder="Ej: Michi..."
                  placeholderTextColor="#9CA3AF"
                  value={tempProfile.catName || ""}
                  onChangeText={(text) =>
                    setTempProfile({ ...tempProfile, catName: text })
                  }
                  maxLength={15}
                />
                <TouchableOpacity
                  style={styles.onboardingNextBtn}
                  onPress={handleNameSubmit}
                  activeOpacity={0.7}
                >
                  <Text style={styles.onboardingNextBtnText}>▶</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {onboardingStep === 1 && (
            <>
              <Text style={styles.onboardingTitle}>ACTIVIDAD</Text>
              <Text style={styles.onboardingSubtitle}>
                Tu ritmo de vida habitual:
              </Text>
              <TouchableOpacity
                style={styles.onboardingBtn}
                onPress={() => handleActivitySelect("sedentary")}
              >
                <Text style={styles.onboardingBtnText}>SEDENTARIO</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.onboardingBtn}
                onPress={() => handleActivitySelect("light")}
              >
                <Text style={styles.onboardingBtnText}>LIGERO</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.onboardingBtn}
                onPress={() => handleActivitySelect("moderate")}
              >
                <Text style={styles.onboardingBtnText}>MODERADO</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.onboardingBtn}
                onPress={() => handleActivitySelect("intense")}
              >
                <Text style={styles.onboardingBtnText}>INTENSO</Text>
              </TouchableOpacity>
            </>
          )}

          {onboardingStep === 2 && (
            <>
              <Text style={styles.onboardingTitle}>OBJETIVO</Text>
              <Text style={styles.onboardingSubtitle}>
                Meta de pasos diarios:
              </Text>
              <TextInput
                style={styles.onboardingInput}
                keyboardType="numeric"
                placeholder="10000"
                placeholderTextColor="#9CA3AF"
                value={customGoal}
                onChangeText={setCustomGoal}
                maxLength={6}
              />
              <TouchableOpacity
                style={[styles.onboardingBtn, { backgroundColor: "#F8BBD0" }]}
                onPress={handleGoalSubmit}
              >
                <Text style={styles.onboardingBtnText}>GUARDAR META</Text>
              </TouchableOpacity>
            </>
          )}

          {onboardingStep === 3 && (
            <>
              <Text style={styles.onboardingTitle}>DESCANSO</Text>
              <Text style={styles.onboardingSubtitle}>
                Horas de sueño diario:
              </Text>
              <TouchableOpacity
                style={styles.onboardingBtn}
                onPress={() => handleSleepSelect("less_4")}
              >
                <Text style={styles.onboardingBtnText}>&lt; 4 HORAS</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.onboardingBtn}
                onPress={() => handleSleepSelect("less_6")}
              >
                <Text style={styles.onboardingBtnText}>&lt; 6 HORAS</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.onboardingBtn}
                onPress={() => handleSleepSelect("6_8")}
              >
                <Text style={styles.onboardingBtnText}>6 A 8 HORAS</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.onboardingBtn}
                onPress={() => handleSleepSelect("more_8")}
              >
                <Text style={styles.onboardingBtnText}>+8 HORAS</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* ÁREA CENTRAL DEL GATO */}
      <View style={styles.lcdCenter}>
        {/* HUD: Placa de nombre y Barra de HP (Pasos) */}
        <View style={styles.hudContainer}>
          <View style={styles.namePlate}>
            <Text style={styles.catNameText}>
              {profile?.catName || "TU GATITO"}
            </Text>
            {compoundState.isInsane && (
              <Image
                source={require("../../assets/images/icono-locura.png")}
                style={styles.madnessIcon}
                resizeMode="contain"
              />
            )}
          </View>
          <View style={{ width: "100%" }}>
            <View style={styles.hpBarWrapper}>
              <Text style={styles.hpLabel}>LVL</Text>
              <View style={styles.hpBarOutline}>
                <View
                  style={[
                    styles.hpBarFill,
                    { width: `${progressPercentage}%` },
                  ]}
                />
                {/* Marca de la Meta Personal del Usuario */}
                <View
                  style={[
                    styles.goalMarker,
                    { left: `${markerPositionPercentage}%` },
                  ]}
                />
              </View>
            </View>
            <View style={styles.hpTextRow}>
              <Text style={styles.hpGoalText}>
                {pedometerSteps} / 12000 OMS
              </Text>
              {pedometerSteps >= 12000 && (
                <Animated.Image
                  source={require("../../assets/images/icono-fuego.png")}
                  style={[
                    styles.fireImage,
                    { transform: [{ scale: fireAnim }] },
                  ]}
                  resizeMode="contain"
                />
              )}
            </View>
          </View>
        </View>

        <Animated.View
          style={[
            styles.imageContainer,
            { transform: [{ translateY: floatAnim }] },
          ]}
        >
          <Image
            source={getCatImage(compoundState, profile?.catColor)}
            style={styles.catImage}
            resizeMode="contain"
          />
        </Animated.View>
        <View style={styles.dialogueBox}>
          <Text style={styles.lcdStateText}>
            > {getCatStateName(compoundState)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#37474F",
    fontFamily: "monospace",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#37474F",
    fontFamily: "monospace",
    marginBottom: 30,
    textAlign: "center",
  },
  lcdCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  hudContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: "flex-start",
  },
  topHudRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  namePlate: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#37474F",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
    boxShadow: "2px 2px 0px rgba(0,0,0,0.2)",
  },
  catNameText: {
    color: "#E8F5E9",
    fontSize: 12,
    fontWeight: "900",
    fontFamily: "monospace",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  madnessIcon: {
    width: 28,
    height: 28,
    marginLeft: 10,
  },
  hpBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  hpLabel: {
    fontFamily: "monospace",
    fontWeight: "900",
    fontSize: 14,
    color: "#37474F",
    marginRight: 8,
  },
  hpBarOutline: {
    flex: 1,
    height: 16,
    borderWidth: 3,
    borderColor: "#37474F",
    backgroundColor: "transparent",
    padding: 1,
    position: "relative",
  },
  hpBarFill: {
    height: "100%",
    backgroundColor: "#37474F",
  },
  goalMarker: {
    position: "absolute",
    top: -3,
    bottom: -3,
    width: 4,
    backgroundColor: "#FBC02D", // Amarillo de advertencia
    borderWidth: 1,
    borderColor: "#37474F",
    zIndex: 10,
  },
  hpTextRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  hpGoalText: {
    fontFamily: "monospace",
    fontSize: 10,
    fontWeight: "900",
    color: "#37474F",
    opacity: 0.6,
  },
  fireImage: {
    width: 16,
    height: 16,
    marginLeft: 5,
  },
  imageContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  dialogueBox: {
    width: "100%",
    backgroundColor: "transparent",
    borderWidth: 3,
    borderColor: "#37474F",
    borderRadius: 8,
    padding: 10,
    marginTop: 15,
    borderStyle: "dashed", // Un borde punteado para darle más estilo de terminal retro
  },
  lcdStateText: {
    fontSize: 12, // Letra un poco más pequeña para que quepan las frases largas
    fontWeight: "900",
    color: "#37474F",
    fontFamily: "monospace",
    textTransform: "uppercase",
    lineHeight: 18,
  },
  catImage: {
    width: "100%",
    height: "100%",
  },

  // ESTILOS DEL ONBOARDING (CUESTIONARIO INICIAL)
  onboardingContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  onboardingCard: {
    backgroundColor: "#FFF9C4",
    padding: 25,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: "#37474F",
    alignItems: "center",
    width: "100%",
    boxShadow: "4px 4px 0px #37474F",
  },
  onboardingImage: {
    width: 90,
    height: 90,
    marginBottom: 20,
  },
  onboardingTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#37474F",
    fontFamily: "monospace",
    textTransform: "uppercase",
    marginBottom: 10,
    textAlign: "center",
  },
  onboardingSubtitle: {
    fontSize: 12,
    color: "#37474F",
    fontFamily: "monospace",
    marginBottom: 20,
    textAlign: "center",
    textTransform: "uppercase",
  },
  onboardingInput: {
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#37474F",
    padding: 15,
    fontSize: 16,
    fontFamily: "monospace",
    marginBottom: 20,
    color: "#37474F",
    width: "100%",
    textAlign: "center",
  },
  onboardingBtn: {
    backgroundColor: "#B2EBF2",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#37474F",
    width: "100%",
    marginBottom: 12,
    alignItems: "center",
    boxShadow: "2px 2px 0px #37474F",
  },
  onboardingBtnText: {
    color: "#37474F",
    fontWeight: "900",
    fontSize: 14,
    fontFamily: "monospace",
    textTransform: "uppercase",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 10,
    marginBottom: 20,
  },
  onboardingNextBtn: {
    backgroundColor: "#F8BBD0",
    width: 54,
    height: 54,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#37474F",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "2px 2px 0px #37474F",
  },
  onboardingNextBtnText: {
    color: "#37474F",
    fontSize: 20,
  },
});
