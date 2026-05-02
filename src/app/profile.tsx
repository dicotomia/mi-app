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

const ProfileScreen = () => {
  const { profile, updateProfile, resetProfile } = useOnboarding();
  const router = useRouter();

  // Estados locales para la edición
  const [catName, setCatName] = useState(profile?.catName || "");
  const [catColor, setCatColor] = useState(profile?.catColor || "orange");
  const [activityLevel, setActivityLevel] = useState(
    profile?.activityLevel || "moderate",
  );
  const [smoker, setSmoker] = useState(profile?.smoker || false);

  const handleSave = () => {
    updateProfile({
      catName: catName || "Gatito",
      catColor,
      activityLevel,
      smoker,
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
      <Text style={styles.header}>⚙️ Menú Tamagotchi</Text>
      <Text style={styles.subtitle}>
        Personaliza a {profile?.catName || "tu mascota"} y actualiza tu estado.
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🐾 Tu Compañero</Text>

        <Text style={styles.label}>Nombre:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Michi, Garfield..."
          value={catName}
          onChangeText={setCatName}
          maxLength={15}
        />

        <Text style={styles.label}>Color del pelaje:</Text>
        <View style={styles.colorRow}>
          <TouchableOpacity
            style={[
              styles.colorBox,
              catColor === "orange" && styles.colorBoxActive,
            ]}
            onPress={() => setCatColor("orange")}
          >
            <Text style={styles.emoji}>🐈</Text>
            <Text style={styles.colorName}>Naranja</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.colorBox,
              catColor === "black" && styles.colorBoxActive,
            ]}
            onPress={() => setCatColor("black")}
          >
            <Text style={styles.emoji}>🐈‍⬛</Text>
            <Text style={styles.colorName}>Negro</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.colorBox,
              catColor === "white" && styles.colorBoxActive,
            ]}
            onPress={() => setCatColor("white")}
          >
            <Text style={styles.emoji}>🐱</Text>
            <Text style={styles.colorName}>Blanco</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>👤 Hábitos</Text>

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

        <Text style={styles.label}>Fumador:</Text>
        <View style={styles.habitRow}>
          <TouchableOpacity
            style={[styles.habitBtn, !smoker && styles.colorBoxActive]}
            onPress={() => setSmoker(false)}
          >
            <Text style={styles.habitText}>No 🌿</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.habitBtn, smoker && { backgroundColor: "#FECACA" }]}
            onPress={() => setSmoker(true)}
          >
            <Text style={styles.habitText}>Sí 🚬</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={handleFullReset}>
          <Text style={styles.resetButtonText}>🔄 Rehacer test de salud</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>💾 Guardar Cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFB7B2" },
  content: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  header: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1F2937",
    fontFamily: "monospace",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#374151",
    fontFamily: "monospace",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#F8FAFC",
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
    fontSize: 20,
    fontWeight: "900",
    color: "#1F2937",
    fontFamily: "monospace",
    textTransform: "uppercase",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "900",
    fontFamily: "monospace",
    marginBottom: 8,
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
  },
  colorRow: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  colorBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#1F2937",
  },
  colorBoxActive: { backgroundColor: "#FDE047" }, // Seleccionado se vuelve amarillo pastel
  emoji: { fontSize: 32, marginBottom: 5 },
  colorName: {
    fontSize: 12,
    fontWeight: "900",
    color: "#1F2937",
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
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#1F2937",
    alignItems: "center",
  },
  habitText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#1F2937",
    fontFamily: "monospace",
    textTransform: "uppercase",
  },
  resetButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#FECACA",
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#1F2937",
    alignItems: "center",
  },
  resetButtonText: {
    color: "#1F2937",
    fontWeight: "900",
    fontFamily: "monospace",
    textTransform: "uppercase",
  },
  saveButton: {
    backgroundColor: "#34D399", // Verde para guardar
    paddingVertical: 18,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#1F2937",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#1F2937",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  saveButtonText: {
    color: "#1F2937",
    fontWeight: "900",
    fontSize: 16,
    fontFamily: "monospace",
    textTransform: "uppercase",
  },
});

export default ProfileScreen;
