import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useOnboarding } from "../hooks/useOnboarding";
import { usePedometer } from "../hooks/usePedometer";

export default function ExploreScreen() {
  const { addSimulatedSteps } = usePedometer();
  const { profile } = useOnboarding();

  const activities = [
    { id: 1, title: "Correr 5km", steps: 6000, icon: "🏃‍♂️", color: "#BAE6FD" },
    {
      id: 2,
      title: "Pasear al perro",
      steps: 2500,
      icon: "🦮",
      color: "#FDE047",
    },
    {
      id: 3,
      title: "Entrenamiento (Pesas)",
      steps: 3000,
      icon: "🏋️",
      color: "#E9D5FF",
    },
    {
      id: 4,
      title: "Limpiar la casa",
      steps: 1500,
      icon: "🧹",
      color: "#A7F3D0",
    },
    {
      id: 5,
      title: "Clase de Yoga",
      steps: 2000,
      icon: "🧘",
      color: "#FECDD3",
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Zona de Actividades</Text>
      <Text style={styles.subtitle}>
        Registra lo que has hecho hoy para mejorar la salud de{" "}
        {profile?.catName || "tu gatito"}.
      </Text>

      <View style={styles.grid}>
        {activities.map((activity) => (
          <TouchableOpacity
            key={activity.id}
            activeOpacity={0.6}
            style={[styles.activityCard, { backgroundColor: activity.color }]}
            onPress={() => addSimulatedSteps(activity.steps)}
          >
            <Text style={styles.icon}>{activity.icon}</Text>
            <Text style={styles.activityTitle}>{activity.title}</Text>
            <Text style={styles.activitySteps}>+{activity.steps} pts</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFB7B2",
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1F2937",
    fontFamily: "monospace",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#374151",
    fontFamily: "monospace",
    marginBottom: 30,
    lineHeight: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  activityCard: {
    width: "47%",
    padding: 20,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#1F2937",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1F2937",
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    marginBottom: 15,
  },
  icon: { fontSize: 40, marginBottom: 10 },
  activityTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#111827",
    fontFamily: "monospace",
    textAlign: "center",
    marginBottom: 5,
  },
  activitySteps: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "bold",
    fontFamily: "monospace",
  },
});
