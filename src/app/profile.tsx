import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useOnboarding } from "../hooks/useOnboarding";
import { usePedometer } from "../hooks/usePedometer";

const ProfileScreen = () => {
  const { profile, updateProfile, resetProfile } = useOnboarding();
  const { addSimulatedSteps, resetSteps } = usePedometer();
  const router = useRouter();

  // Estados locales para la edición
  const [catName, setCatName] = useState(profile?.catName || "");
  const [stepGoal, setStepGoal] = useState(
    profile?.stepGoal?.toString() || "10000",
  );
  const [activityLevel, setActivityLevel] = useState(
    profile?.activityLevel || "moderate",
  );
  const [sleepHours, setSleepHours] = useState(profile?.sleepHours || "6_8");

  const handleSave = () => {
    updateProfile({
      catName: catName || "Gatito",
      stepGoal: parseInt(stepGoal) || 10000,
      activityLevel,
      sleepHours,
    });
    Alert.alert(
      "¡Guardado!",
      `Los datos de ${catName || "tu gatito"} han sido actualizados.`,
    );
  };

  const handleFullReset = () => {
    resetProfile();
    router.replace("/");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Ajustes</Text>
      <Text style={styles.subtitle}>
        Personaliza a {profile?.catName || "tu mascota"} y actualiza tu estado.
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Compañero</Text>

        <Text style={styles.label}>Nombre:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Michi, Garfield..."
          placeholderTextColor="#9CA3AF"
          value={catName}
          onChangeText={setCatName}
          maxLength={15}
        />

        <Text style={styles.label}>Meta de Pasos Diarios:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Ej: 10000"
          placeholderTextColor="#9CA3AF"
          value={stepGoal}
          onChangeText={setStepGoal}
          maxLength={6}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Hábitos</Text>

        <Text style={styles.label}>Nivel de Actividad:</Text>
        <View style={styles.habitRow}>
          <TouchableOpacity
            style={[
              styles.habitBtn,
              activityLevel === "sedentary" && styles.colorBoxActive,
            ]}
            onPress={() => setActivityLevel("sedentary")}
          >
            <Text style={styles.habitText}>Sedentario</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.habitBtn,
              activityLevel === "light" && styles.colorBoxActive,
            ]}
            onPress={() => setActivityLevel("light")}
          >
            <Text style={styles.habitText}>Ligero</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.habitRow, { marginBottom: 20 }]}>
          <TouchableOpacity
            style={[
              styles.habitBtn,
              activityLevel === "moderate" && styles.colorBoxActive,
            ]}
            onPress={() => setActivityLevel("moderate")}
          >
            <Text style={styles.habitText}>Moderado</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.habitBtn,
              activityLevel === "intense" && styles.colorBoxActive,
            ]}
            onPress={() => setActivityLevel("intense")}
          >
            <Text style={styles.habitText}>Intenso</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Horas de sueño:</Text>
        <View style={styles.habitRow}>
          <TouchableOpacity
            style={[
              styles.habitBtn,
              sleepHours === "less_4" && { backgroundColor: "#FECACA" },
            ]}
            onPress={() => setSleepHours("less_4")}
          >
            <Text style={styles.habitText}>&lt; 4h 🧟</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.habitBtn,
              sleepHours === "less_6" && { backgroundColor: "#FDE047" },
            ]}
            onPress={() => setSleepHours("less_6")}
          >
            <Text style={styles.habitText}>&lt; 6h 🥱</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.habitBtn,
              (sleepHours === "6_8" || sleepHours === "more_8") &&
                styles.colorBoxActive,
            ]}
            onPress={() => setSleepHours("6_8")}
          >
            <Text style={styles.habitText}>+6h 😴</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={handleFullReset}>
          <Text style={styles.resetButtonText}>🔄 Rehacer test de salud</Text>
        </TouchableOpacity>
      </View>

      {/* SECCIÓN TEMPORAL DE DESARROLLO (DEV TOOLS) */}
      <View style={styles.devCard}>
        <Text style={styles.devTitle}>⚠️ ZONA DE PRUEBAS (DEV)</Text>
        <View style={styles.devGrid}>
          <TouchableOpacity
            style={styles.devBtn}
            onPress={() => addSimulatedSteps(1000)}
          >
            <Text style={styles.devBtnText}>+1000 PASOS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.devBtn} onPress={resetSteps}>
            <Text style={styles.devBtnText}>RESET PASOS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.devBtn}
            onPress={() =>
              updateProfile({
                sanityPoints: 0,
                lastHobbyDate: Date.now() - 100000000,
              })
            }
          >
            <Text style={styles.devBtnText}>FORZAR LOCURA</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.devBtn}
            onPress={() => updateProfile({ forceSleep: !profile?.forceSleep })}
          >
            <Text style={styles.devBtnText}>
              {profile?.forceSleep ? "☀️ DESPERTAR" : "🌙 FORZAR SUEÑO"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>💾 Guardar Cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },
  content: { padding: 24, paddingTop: 40, paddingBottom: 40 },
  header: {
    fontSize: 28,
    fontWeight: "900",
    color: "#37474F",
    fontFamily: "monospace",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
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
    fontSize: 20,
    fontWeight: "900",
    color: "#37474F",
    fontFamily: "monospace",
    textTransform: "uppercase",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#37474F",
    fontWeight: "900",
    fontFamily: "monospace",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "transparent",
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#37474F",
    padding: 15,
    fontSize: 16,
    fontFamily: "monospace",
    marginBottom: 20,
    color: "#37474F",
  },
  colorRow: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  colorBox: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#37474F",
  },
  colorBoxActive: { backgroundColor: "#37474F" }, // Invertimos para LCD
  emoji: { fontSize: 32, marginBottom: 5 },
  colorName: {
    fontSize: 12,
    fontWeight: "900",
    color: "#E8F5E9", // Verde Menta Pastel
    fontFamily: "monospace",
    textTransform: "uppercase",
  },
  habitRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  habitBtn: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 12,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#37474F",
    alignItems: "center",
  },
  habitText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#37474F",
    fontFamily: "monospace",
    textTransform: "uppercase",
  },
  resetButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "transparent",
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#37474F",
    alignItems: "center",
  },
  resetButtonText: {
    color: "#37474F",
    fontWeight: "900",
    fontFamily: "monospace",
    textTransform: "uppercase",
  },
  saveButton: {
    backgroundColor: "transparent",
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: "#37474F",
    alignItems: "center",
    marginTop: 10,
    boxShadow: "4px 4px 0px #37474F",
  },
  saveButtonText: {
    color: "#37474F",
    fontWeight: "900",
    fontSize: 16,
    fontFamily: "monospace",
    textTransform: "uppercase",
  },
  devCard: {
    backgroundColor: "#FFEBEE", // Fondo rosado de alerta
    padding: 20,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#D32F2F", // Borde rojo fuerte
    borderStyle: "dashed",
    marginBottom: 20,
  },
  devTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#D32F2F",
    fontFamily: "monospace",
    textAlign: "center",
    marginBottom: 15,
  },
  devGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  devBtn: {
    backgroundColor: "transparent",
    padding: 10,
    borderWidth: 2,
    borderColor: "#D32F2F",
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  devBtnText: {
    color: "#D32F2F",
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
});

export default ProfileScreen;
