//screens/LoginView.tsx


import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
//import { StyleSheet, Text, View } from 'react-native';

const LoginView = () => {
  return (
    <View style={styles.container}>
      <Text>Open up LoginView.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});