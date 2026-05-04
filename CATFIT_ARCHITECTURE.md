# 🐱 Dicocat: Documento de Arquitectura y Diseño

**Dirección de Arte:** En todo momento, la experiencia visual de la aplicación estará basada en un estricto **estilo pixel art tipo Tamagotchi**, utilizando una paleta de **colores pasteles** y destacando por incorporar **muchas animaciones** continuas (movimientos _idle_, reacciones de la mascota, parpadeos de alertas en la interfaz LCD) para asegurar que el dispositivo virtual se sienta completamente vivo y dinámico.

---

## 1. Los Tres Pilares de Datos (Inputs)

La aplicación se alimenta de tres variables biométricas y de comportamiento que definen el destino de la mascota. Estas variables deben actualizarse constantemente (vía Health Connect o registros en la app).

- **Pilar A: Vitalidad (Pasos - Motor Principal):** Define la ubicación/postura de la mascota. Basado en los niveles de actividad de la OMS.
- **Pilar B: Energía (Sueño - Modificador):** Define el nivel de fatiga (estado de los ojos, animaciones lentas o enérgicas).
- **Pilar C: Cordura (Hobbies - Modificador):** Define el temperamento/aura (expresiones erráticas, paranoia o un estado de paz).

---

## 2. La Arquitectura de Estados (State Machine)

La aplicación no elige imágenes al azar; sigue un orden jerárquico estricto. El estado final se calcula mediante un árbol de decisión compuesto.

**Fórmula del Sistema de Puntuación Interna:**
$$Estado_{Visual} = f(Pasos, Sueño, Hobbies)$$

**Jerarquía de Cálculo:**

- **Prioridad 1 (Base - Pasos):** El rango de pasos selecciona uno de los 5 escenarios y posturas base del cuerpo.
- **Prioridad 2 (Filtro - Sueño):** El sueño aplica una capa de textura/animación ("Cansado" o "Despierto").
- **Prioridad 3 (Capa Final - Cordura):** Los hobbies aplican el efecto visual final de "Locura" o "Estabilidad" (auras, tics).

---

## 3. Matriz de Estados Detallada (El "Mapa de Sprites")

Esta matriz define los $5 \times 2 \times 2 = 20$ estados únicos que estructuran el diseño visual de la mascota.

| Nivel de Vitalidad (Pasos) | Escenario Base (Prioridad 1) | + Modificador Sueño Bajo (Prioridad 2) | + Modificador Locura / Sin Hobbies (Prioridad 3) |
| :------------------------- | :--------------------------- | :------------------------------------- | :----------------------------------------------- |
| **1. Alerta (0-2.5k)**     | En la cama.                  | Zzz (ronquidos).                       | Mirada al vacío / Paranoia.                      |
| **2. Perezoso (2.5k-5k)**  | En el sofá.                  | Babeando / Ojos pesados.               | Cambiando canales frenético.                     |
| **3. Neutral (5k-7.5k)**   | De pie / Salón.              | Bostezos constantes.                   | Hablando solo / Despeinado.                      |
| **4. Enérgico (7.5k-11k)** | Patio / Gimnasio.            | Sudor de agotamiento.                  | Ejercicio obsesivo / Tics.                       |
| **5. Atleta (+11k)**       | Pista de atletismo.          | Aura de fuego azul (débil).            | Aura de fuego negro (caótico).                   |

### 3.1. Estructura de Assets y Mapeo de Archivos

Los sprites se organizan en subcarpetas según el color de la mascota elegido en el perfil (ej. `assets/images/negro/`, `assets/images/naranja/`, `assets/images/blanco/`). El motor de la aplicación busca los siguientes nombres exactos de archivo basándose en las condicionales de vitalidad y sueño:

**Escenarios Base (Cuerpo entero):**

- `< 2,500 pasos:` `alerta.png`
- `< 5,000 pasos:` `perezoso.png`
- `< 7,500 pasos:` `neutral.png`
- `< 11,000 pasos:` `energetico.png`
- `>= 11,000 pasos:` `atleta.png`

**Estados Especiales:**

- `durmiendo.png`: Se muestra por defecto entre las 00:00 y las 06:00 AM, despertándose automáticamente si el usuario acumula más de 100 pasos en esa madrugada.

**Caras para Estadísticas:**
La pantalla de estadísticas lee el estado base actual y busca el mismo nombre de archivo pero añadiéndole el sufijo `-cara` (ej. `alerta-cara.png`, `energetico-cara.png`, `durmiendo-cara.png`). Esto permite mantener coherencia visual entre el cuerpo entero y el avatar del menú de datos.

---

## 4. Mecánicas Críticas de Juego

Para que el ecosistema se sienta vivo e independiente del uso directo de la app, operan tres mecánicas subyacentes:

### A. El "Tick" de Actualización (Background Service)

La aplicación no se actualiza solo cuando se abre. Un Background Service consultará Health Connect y el almacenamiento local cada X tiempo (ej. cada 30 minutos) para recalcular el estado. Si el usuario abre la app tras una caminata sin el móvil encendido, la mascota ya habrá "evolucionado" en segundo plano.

### B. El Contador de Degradación (Decay)

Si el usuario no registra actividad o hobbies, los puntos internos de la mascota decrecen pasivamente.

- **Mecánica de Locura:** Si pasan más de 24 horas sin registrar un hobby, el flag `isInsane` se activa automáticamente.
- **Mecánica de Recuperación:** Realizar un hobby o dormir > 7h "limpia" los modificadores negativos (fatiga/locura) de forma instantánea.

### C. Sistema de Notificaciones Empáticas

La mascota se comunicará a través de notificaciones push reactivas a sus estados compuestos. Ejemplos:

- _Estado Alerta + Loco:_ "Me siento atrapado en estas sábanas... el mundo se ve extraño."
- _Estado Atleta + Zen:_ "¡Siento que puedo volar! Gracias por cuidarnos."

### D. El Ciclo Diario (Reset a Medianoche)

Cada día a las 00:00 horas, los datos de vitalidad (pasos) se resetean a cero para comenzar un nuevo ciclo. En este momento exacto y durante las primeras horas de la madrugada, la imagen inicial por defecto de la mascota será **durmiendo** (ignorando temporalmente otros modificadores de estrés o fatiga), reflejando el descanso fisiológico natural antes de comenzar a evaluar la actividad del nuevo día.

---

## 5. Stack Tecnológico

- **Framework:** React Native con **Expo (SDK 55)**.
- **Navegación:** **Expo Router** (basado en archivos para manejo eficiente de pestañas y modales).
- **UI / Estilos:** StyleSheet de React Native simulando interfaces 8-bits/LCD, con enfoque en pixel art, colores pasteles y animaciones fluidas (`Animated` API / Reanimated).
- **Datos Biométricos:** `expo-sensors` y puente hacia **Health Connect** / Apple Health.
- **Tareas en Segundo Plano:** `expo-background-fetch` y `expo-task-manager` para el "Tick" de actualización.
- **Persistencia:** AsyncStorage para persistencia local de la máquina de estados.
- **Notificaciones:** `expo-notifications` para los mensajes empáticos locales disparados por el Background Service.

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
├── tasks/                    # Definición de tareas en Background (Tick Update)
├── hooks/                    # Custom Hooks
│   ├── usePedometer.ts       # Lógica del sensor de pasos
│   └── useCatState.ts        # Cálculo del estado del gato basado en salud
├── store/                    # Manejo de estado global (Context API o Zustand)
└── utils/                    # Funciones de ayuda (formatos de fecha, cálculos)
```

---

## 7. MVP (Producto Mínimo Viable) - Hoja de Ruta

Para tener una primera versión funcional y testeable rápidamente, seguiremos estos pasos:

1.  **Reestructuración de Datos:** Adaptar el estado global (Zustand/Hooks) para trackear Pasos, Sueño (horas) y Fecha del último Hobby.
2.  **State Machine:** Implementar la fórmula $f(Pasos, Sueño, Hobbies)$ en un módulo puro (ej. `lib/cat.ts`) devolviendo uno de los 20 estados.
3.  **Sistema de Decay (Básico):** Comparar fechas (`lastHobbyDate` vs `Date.now()`) al iniciar la app para forzar el estado de "Locura".
4.  **Actualización UI:** Renderizar el background/escenario correcto + Sprite base del gato + Auroras/Tics según los modificadores.
5.  **Integración Avanzada:** Configurar `expo-background-fetch` para calcular el estado sin abrir la app y lanzar `expo-notifications`.
