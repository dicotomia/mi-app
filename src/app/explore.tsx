import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useOnboarding } from "../hooks/useOnboarding";

const ACTIVITIES = [
  {
    id: 1,
    title: "Deporte",
    points: 30,
    image: require("../../assets/images/negro/actividades/deporte.png"),
  },
  {
    id: 2,
    title: "Socializar",
    points: 25,
    image: require("../../assets/images/negro/actividades/amigos.png"),
  },
  {
    id: 3,
    title: "Hobby",
    points: 20,
    image: require("../../assets/images/negro/actividades/hobby.png"),
  },
  {
    id: 4,
    title: "Comer Sano",
    points: 15,
    image: require("../../assets/images/negro/actividades/comida-saludable.png"),
  },
  {
    id: 5,
    title: "Leer",
    points: 15,
    image: require("../../assets/images/negro/actividades/leer.png"),
  },
  {
    id: 6,
    title: "Actividad",
    points: 10,
    image: require("../../assets/images/negro/actividades/actividad.png"),
  },
];

export default function ExploreScreen() {
  const { profile, updateProfile } = useOnboarding();

  const currentSanity = profile?.sanityPoints || 0;

  const handleActivity = (points: number) => {
    // Sumamos los puntos limitando el máximo a 100
    const newSanity = Math.min(currentSanity + points, 100);

    updateProfile({
      sanityPoints: newSanity,
      lastHobbyDate: Date.now(),
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* HEADER COMPACTO Y MINIMALISTA */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>ACTIVIDADES</Text>
        <View style={styles.sanityCompact}>
          <Text style={styles.sanityLabel}>MENTE: {currentSanity}%</Text>
          <View style={styles.sanityBarBg}>
            <View
              style={[styles.sanityBarFill, { width: `${currentSanity}%` }]}
            />
          </View>
        </View>
      </View>

      <View style={styles.grid}>
        {ACTIVITIES.map((activity) => (
          <TouchableOpacity
            key={activity.id}
            activeOpacity={0.5}
            style={styles.activityItem}
            onPress={() => handleActivity(activity.points)}
          >
            <View style={styles.imageContainer}>
              <Image
                source={activity.image}
                style={styles.activityImage}
                resizeMode="contain"
              />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>+{activity.points}</Text>
              </View>
            </View>
            <Text style={styles.activityTitle}>{activity.title}</Text>
          </TouchableOpacity>
        ))}
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
    padding: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    borderBottomWidth: 3,
    borderBottomColor: "#37474F",
    paddingBottom: 15,
  },
  header: {
    fontSize: 22,
    fontWeight: "900",
    color: "#37474F",
    fontFamily: "monospace",
    textTransform: "uppercase",
  },
  sanityCompact: {
    alignItems: "flex-end",
    width: "40%",
  },
  sanityLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: "#37474F",
    fontFamily: "monospace",
    marginBottom: 4,
  },
  sanityBarBg: {
    width: "100%",
    height: 12,
    backgroundColor: "transparent",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#37474F",
    padding: 1,
  },
  sanityBarFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#37474F",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: 10,
  },
  activityItem: {
    width: "42%",
    alignItems: "center",
    marginBottom: 25,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 10,
  },
  activityImage: {
    width: 90,
    height: 90,
  },
  badge: {
    position: "absolute",
    bottom: -5,
    right: -10,
    backgroundColor: "#37474F",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    color: "#E8F5E9", // LCD Verde Menta
    fontSize: 10,
    fontWeight: "900",
    fontFamily: "monospace",
  },
  activityTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: "#37474F",
    fontFamily: "monospace",
    textAlign: "center",
    textTransform: "uppercase",
  },
});
