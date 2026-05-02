# 🐱 Dicocat: Documento de Arquitectura y Diseño

## 1. Concepto Central

**Dicocat** no es solo un Tamagotchi; es un reflejo de tus propios hábitos de salud. El gato virtual funciona como un "espejo" del bienestar del usuario. Su estado físico, estado de ánimo y salud general están directamente vinculados a los datos biométricos y de actividad física del dueño.

- **Actividad Física:** Si el usuario cumple sus metas de pasos diarios, el gato se vuelve esbelto, enérgico y feliz. Si el usuario es sedentario, el gato engorda, se vuelve perezoso y deprimido.
- **Hábitos Nocivos:** (Ej. Tabaquismo reportado) Si el usuario reporta fumar o no dejar el hábito, el gato mostrará signos de mala salud (ej. toser, tener un pelaje descuidado).
- **Descanso:** Si el usuario duerme las horas recomendadas, el gato tendrá energía al despertar. Si hay déficit de sueño, el gato tendrá ojeras y estará letárgico durante el día.

El objetivo es generar empatía y responsabilidad: cuidar de ti mismo es la única forma de cuidar de tu mascota virtual.

---

## 2. Flujo de Onboarding

Para personalizar la experiencia, la app iniciará con una evaluación rápida del estilo de vida del usuario. Este onboarding establecerá la "línea base" de la mascota.

- **Pantalla 1: Bienvenida y Adopción.** El usuario elige a su gatito inicial (solo cambia el color/patrón).
- **Pantalla 2: Perfil de Actividad.** ¿Cuál es tu nivel de actividad física actual? (Sedentario, Ligero, Moderado, Intenso).
- **Pantalla 3: Metas de Pasos.** Definición de la meta diaria (ej. 8,000 o 10,000 pasos).
- **Pantalla 4: Hábitos.** Preguntas sobre tabaquismo (Sí/No) y dieta general.
- **Pantalla 5: Sueño.** ¿Cuántas horas sueles dormir por noche?
- **Pantalla 6: Permisos.** Solicitud de permisos para acceder a los datos de salud del dispositivo y podómetro.

---

## 3. Integración de Salud y Datos

La recolección de datos es el motor del estado del gato.

- **Actividad en Tiempo Real (Pasos):** Se utilizará `expo-sensors` (específicamente el módulo `Pedometer`) para contar los pasos a lo largo del día y mostrar progreso en tiempo real cuando la app esté abierta.
- **Datos Históricos y Avanzados (Futuro):** Integración con Apple Health / Google Fit a través de paquetes como `react-native-health` (o alternativas compatibles con Expo) para leer calorías quemadas, horas de sueño registradas y frecuencia cardíaca.
- **Actualización del Estado:** Los datos se sincronizan cada vez que se abre la app y se calculan contra las metas establecidas en el onboarding para determinar la "puntuación de salud" actual.

---

## 4. Lógica del Gato (Estados y KPIs)

El estado del gato es una máquina de estados finitos basada en una puntuación compuesta de salud (0-100).

- **Atlético / Feliz (Puntuación 80-100):**
  - _Condición:_ Meta de pasos alcanzada consistentemente, buen reporte de sueño.
  - _Visual:_ Gato delgado, animado, hace piruetas, exige jugar.
- **Normal (Puntuación 50-79):**
  - _Condición:_ Actividad promedio, cumple parcialmente las metas.
  - _Visual:_ Estado neutral, ocasionalmente se acicala, duerme siestas normales.
- **Perezoso / Gordo (Puntuación 20-49):**
  - _Condición:_ Varios días sin alcanzar un mínimo de pasos (sedentarismo).
  - _Visual:_ Gato con sobrepeso visible, no quiere jugar, pasa casi todo el tiempo acostado, gruñón.
- **Enfermo (Puntuación 0-19 o mal hábito activo):**
  - _Condición:_ Sedentarismo extremo + reporte de tabaquismo o mal sueño crítico.
  - _Visual:_ Gato con termómetro, tosiendo, pelaje opaco, requiere "medicina" (que el usuario complete una meta urgente como caminar 30 minutos).

---

## 5. Stack Tecnológico

- **Framework:** React Native con **Expo (SDK 55)**.
- **Navegación:** **Expo Router** (basado en archivos para manejo eficiente de pestañas y modales).
- **UI / Estilos:** Tailwind CSS (vía NativeWind o similar para estilos globales) o StyleSheet tradicional mejorado. Se utilizarán componentes funcionales con Hooks.
- **Iconografía:** **Lucide-react-native** (iconos limpios y modernos).
- **Almacenamiento Local:** **AsyncStorage** (para guardar el estado actual del gato, los datos del onboarding y el historial básico de metas sin necesidad de un backend inmediato).
- **Sensores:** `expo-sensors` (`Pedometer`).

---

## 6. Estructura de Carpetas Sugerida

Utilizando el paradigma de Expo Router:

```
src/
├── app/                      # Rutas de Expo Router
│   ├── _layout.tsx           # Layout principal (Providers, Navigation)
│   ├── (tabs)/               # Grupo de pestañas
│   │   ├── _layout.tsx       # Configuración de las pestañas
│   │   ├── index.tsx         # Pantalla principal (El Gato)
│   │   ├── stats.tsx         # Estadísticas del usuario
│   │   └── settings.tsx      # Configuración y reevaluación
│   └── onboarding/           # Flujo de inicio
│       ├── _layout.tsx
│       ├── step1.tsx
│       └── ...
├── components/               # Componentes reutilizables
│   ├── cat/                  # Componentes específicos del gato
│   │   ├── CatAvatar.tsx     # Renderizado del gato según su estado
│   │   └── CatStatus.tsx     # Burbujas de diálogo, indicadores
│   ├── ui/                   # Componentes genéricos (Botones, Tarjetas)
│   └── charts/               # Gráficos de actividad
├── constants/                # Variables globales, temas, colores
├── hooks/                    # Custom Hooks
│   ├── usePedometer.ts       # Lógica del sensor de pasos
│   └── useCatState.ts        # Cálculo del estado del gato basado en salud
├── store/                    # Manejo de estado global (Context API o Zustand)
└── utils/                    # Funciones de ayuda (formatos de fecha, cálculos)
```

---

## 7. MVP (Producto Mínimo Viable) - Hoja de Ruta

Para tener una primera versión funcional y testeable rápidamente, seguiremos estos pasos:

1.  **Setup del Proyecto:** Limpiar el proyecto base de Expo, configurar alias, instalar `expo-sensors`, `lucide-react-native` y `async-storage`.
2.  **Pantalla Principal Estática:** Crear `app/(tabs)/index.tsx`. Implementar un renderizado básico del gato (puede ser un SVG estático por ahora o una imagen base) y un diseño de UI para los indicadores de salud (barras de progreso).
3.  **Integración del Podómetro:** Crear el hook `usePedometer.ts` para solicitar permisos y comenzar a contar los pasos del día actual.
4.  **Vincular Datos Básicos:** Conectar los pasos del podómetro a la interfaz principal. Mostrar "Pasos hoy: X / 10,000".
5.  **Lógica Simple de Estado:** Programar una función básica: si `pasos < 3000`, mostrar imagen de "gato triste"; si `pasos >= 3000`, mostrar imagen de "gato feliz".
6.  **Persistencia Básica:** Guardar los pasos diarios y la meta en `AsyncStorage` para que no se pierdan al recargar la app.
7.  **Refinamiento UI:** Añadir estilos, iconos de Lucide, y asegurar que la pantalla se vea moderna y pulida.
