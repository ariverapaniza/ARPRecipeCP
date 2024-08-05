// components/LoadingView.tsx
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingView = ({ show }) => {
  if (!show) return null;
  
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoadingView;
