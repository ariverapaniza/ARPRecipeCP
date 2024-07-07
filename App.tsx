// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig, auth } from './firebaseConfig';
import MainView from './screens/MainView';
import LoginView from './screens/LoginView';
import { AuthContext } from './AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MenuProvider } from 'react-native-popup-menu';

const Stack = createNativeStackNavigator();

const App = () => {
  const [logStatus, setLogStatus] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLogStatus(true);
      } else {
        setLogStatus(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ logStatus, setLogStatus }}>
      <MenuProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator>
              {logStatus ? (
                <Stack.Screen name="Main" component={MainView} />
              ) : (
                <Stack.Screen name="Login" component={LoginView} />
              )}
            </Stack.Navigator>
          </NavigationContainer>
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </MenuProvider>
    </AuthContext.Provider>
  );
};

export default App;
