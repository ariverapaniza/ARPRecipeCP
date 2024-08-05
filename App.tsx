// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig, auth } from './firebaseConfig';
import MainView from './screens/MainView';
import LoginView from './screens/LoginView';
import CreateNewPost from './screens/CreateNewPost';
import RegisterView from './screens/RegisterView';
import PostDetailView from './screens/PostDetailView';
import EditPostView from './screens/EditPostView';
import { AuthContext } from './AuthContext';
import { AppRegistry } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MenuProvider } from 'react-native-popup-menu';

const Stack = createNativeStackNavigator();

const App = () => {
  const [logStatus, setLogStatus] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLogStatus(!!user);
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
                <>
                  <Stack.Screen name="ARP-Recipe" component={MainView} />
                  <Stack.Screen name="CreateNewPost" component={CreateNewPost} />
                  <Stack.Screen name="PostDetail" component={PostDetailView} />
                  <Stack.Screen name="EditPost" component={EditPostView} />
                </>
              ) : (
                <>
                  <Stack.Screen name="Login" component={LoginView} />
                  <Stack.Screen name="Register" component={RegisterView} />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </MenuProvider>
    </AuthContext.Provider>
  );
};

AppRegistry.registerComponent('main', () => App);

export default App;
