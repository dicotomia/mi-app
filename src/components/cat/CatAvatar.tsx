import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Activity, Zzz, Meh, HeartPulse } from 'lucide-react-native';
import { CatState } from '../../hooks/useCatState';

interface CatAvatarProps {
  state: CatState;
}

export function CatAvatar({ state }: CatAvatarProps) {
  let Icon = Meh;
  let color = '#888';
  let message = '';
  let emoji = '🐱';

  switch (state) {
    case 'athletic':
      Icon = Activity;
      color = '#10b981'; // emerald
      message = '¡Me siento genial!';
      emoji = '😸';
      break;
    case 'normal':
      Icon = Meh;
      color = '#3b82f6'; // blue
      message = 'Un día tranquilo...';
      emoji = '🐱';
      break;
    case 'lazy':
      Icon = Zzz;
      color = '#f59e0b'; // amber
      message = 'Necesito moverme más...';
      emoji = '🥱';
      break;
    case 'sick':
      Icon = HeartPulse;
      color = '#ef4444'; // red
      message = 'Me siento mal, ¡vamos a caminar!';
      emoji = '🤒';
      break;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.avatarCircle, { borderColor: color }]}>
        <Text style={styles.catEmoji}>{emoji}</Text>
        <View style={styles.iconOverlay}>
          <Icon size={32} color={color} />
        </View>
      </View>
      <Text style={[styles.message, { color }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  avatarCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  catEmoji: {
    fontSize: 80,
  },
  iconOverlay: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  message: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  }
});