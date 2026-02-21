import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated } from 'react-native';

export default function App() {
  const [intent, setIntent] = useState(0);
  const [direction, setDirection] = useState('NEUTRAL');
  const pan = useState(new Animated.ValueXY({ x: 0, y: 0 }))[0];
  const panResponderRef = useRef(null);

  useEffect(() => {
    if (!panResponderRef.current) {
      panResponderRef.current = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (e, gestureState) => {
          // Limit joystick movement to a circle
          const dist = Math.sqrt(gestureState.dx**2 + gestureState.dy**2);
          if (dist < 70) {
            pan.setValue({ x: gestureState.dx, y: gestureState.dy });
            // Calculate "Neural Strength" based on distance from center
            setIntent(Math.floor((dist / 70) * 100));
            
            // Calculate direction
            const angle = Math.atan2(gestureState.dy, gestureState.dx) * (180 / Math.PI);
            if (angle > -45 && angle <= 45) setDirection('RIGHT');
            else if (angle > 45 && angle <= 135) setDirection('DOWN');
            else if (angle > 135 || angle <= -135) setDirection('LEFT');
            else setDirection('UP');
          }
        },
        onPanResponderRelease: () => {
          // Snap back to center
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
          setIntent(0);
          setDirection('NEUTRAL');
        },
      });
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BMX NEURAL CONTROL</Text>
      
      <View style={styles.dataPanel}>
        <Text style={styles.dataLabel}>INTENT STRENGTH</Text>
        <Text style={styles.dataValue}>{intent}%</Text>
        <Text style={styles.directionLabel}>DIRECTION: {direction}</Text>
      </View>

      {/* The Joystick Base */}
      <View style={styles.joystickBase}>
        {/* The Draggable Stick */}
        <Animated.View
          {...panResponderRef.current.panHandlers}
          style={[pan.getLayout(), styles.stick]}
        />
      </View>

      <Text style={styles.footer}>DRAG TO SIMULATE BRAIN INPUT</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#00FF00', fontSize: 20, fontWeight: 'bold', position: 'absolute', top: 60 },
  dataPanel: { marginBottom: 50, alignItems: 'center' },
  dataLabel: { color: '#555', fontSize: 12, letterSpacing: 2 },
  dataValue: { color: '#00FF00', fontSize: 64, fontWeight: '900' },
  directionLabel: { color: '#00FF00', fontSize: 14, marginTop: 10, letterSpacing: 1 },
  joystickBase: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#111', borderWidth: 2, borderColor: '#333', justifyContent: 'center', alignItems: 'center' },
  stick: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#00FF00', shadowColor: '#00FF00', shadowOpacity: 0.5, shadowRadius: 10, elevation: 10 },
  footer: { color: '#333', marginTop: 30, fontSize: 10 }
});