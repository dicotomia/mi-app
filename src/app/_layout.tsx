import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Slot, usePathname, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useOnboarding } from "../hooks/useOnboarding";

const TABS = [
  { route: "/", icon: require("../../assets/images/icono-home.png") },
  {
    route: "/explore",
    icon: require("../../assets/images/icono-actividades.png"),
  },
  {
    route: "/stats",
    icon: require("../../assets/images/icono-estadisticas.png"),
  },
  { route: "/profile", icon: require("../../assets/images/icono-ajustes.png") },
];

// Componente personalizado animado para cada botón de la barra
const TabButton = ({
  item,
  isActive,
  onPress,
}: {
  item: any;
  isActive: boolean;
  onPress: () => void;
}) => {
  const iconAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive) {
      Animated.sequence([
        Animated.timing(iconAnim, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(iconAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isActive]);

  return (
    <TouchableOpacity
      style={styles.tabButton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Animated.View
        style={{ transform: [{ scale: isActive ? iconAnim : 1 }] }}
      >
        <Image
          source={item.icon}
          style={[styles.tabIcon, { opacity: isActive ? 1 : 0.4 }]}
          resizeMode="contain"
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();
  // Extraemos el "área segura" del móvil (espacio de la batería, botones físicos, etc.)
  const insets = useSafeAreaInsets();
  const { isCompleted } = useOnboarding();

  // Estado de la pantalla de carga global
  const [isAppReady, setIsAppReady] = useState(false);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const fullText = "dicocat...";
    let currentIndex = 0;

    // Animación de máquina de escribir
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, currentIndex));
      currentIndex++;

      // Añadimos una pequeña pausa invisible al final antes de reiniciar el efecto
      if (currentIndex > fullText.length + 4) {
        currentIndex = 0;
      }
    }, 150); // Velocidad de tipeo: 150ms por letra

    // Simulador de carga de bases de datos, imágenes e inicialización
    const prepareApp = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3500));
      setIsAppReady(true);
    };
    prepareApp();

    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View
        style={[
          styles.phoneShell,
          !isCompleted && { paddingBottom: insets.bottom + 20 },
        ]}
      >
        {/* PANTALLA LCD PRINCIPAL (Sin el div extra) */}
        <View style={styles.lcdScreen}>
          <Slot />
        </View>

        {/* BARRA DE NAVEGACIÓN (Estilo Instagram / Animada) */}
        {isCompleted && (
          <View
            style={[
              styles.navBar,
              { paddingBottom: insets.bottom > 0 ? insets.bottom + 5 : 20 },
            ]}
          >
            {TABS.map((tab) => (
              <TabButton
                key={tab.route}
                item={tab}
                isActive={pathname === tab.route}
                onPress={() => router.replace(tab.route as any)}
              />
            ))}
          </View>
        )}
      </View>

      {/* PANTALLA DE CARGA (Aparece por encima de todo al iniciar) */}
      {!isAppReady && (
        <View style={styles.splashOverlay}>
          <Image
            source={require("../../assets/images/gatogirando.gif")}
            style={styles.splashGif}
          />
          {/* Añadimos un pequeño bloque █ simulando el cursor de la terminal */}
          <Text style={styles.splashText}>{typedText}█</Text>
        </View>
      )}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  phoneShell: {
    flex: 1,
    backgroundColor: "#F8BBD0", // Carcasa Rosa Pastel
    paddingTop: 110, // Aumentamos el espacio por arriba para centrar la pantalla LCD
    alignItems: "center",
  },
  lcdScreen: {
    width: "92%",
    flex: 1,
    backgroundColor: "#E8F5E9", // Fondo LCD Menta Pastel
    borderRadius: 30,
    borderWidth: 6,
    borderColor: "#37474F", // Gris Pizarra para suavisar bordes
    overflow: "hidden",
    boxShadow: "0px 10px 10px rgba(0, 0, 0, 0.3)",
    marginBottom: 20, // Separación visual de la barra de navegación
  },
  navBar: {
    flexDirection: "row",
    backgroundColor: "#FFF9C4", // Amarillo claro pastel
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 4,
    borderTopColor: "#FBC02D",
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
  },
  tabIcon: {
    width: 44,
    height: 44,
  },
  // Estilos de la Pantalla de Carga
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#E8F5E9", // Mismo fondo que la LCD para transición fluida
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999, // Se asegura de estar encima de toda la app
  },
  splashGif: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  splashText: {
    fontSize: 36,
    fontWeight: "900",
    color: "#37474F",
    fontFamily: "monospace",
  },
});
