//screens/MainView.tsx

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

const MainView = () => {
  return (
    <View style={styles.container}>
      <Text>Open up MainView.tsx to start working on your app!</Text>
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