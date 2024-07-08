// screens/LoginView.tsx
import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { AuthContext } from '../AuthContext';

const LoginView = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setLogStatus } = useContext(AuthContext);
  const auth = getAuth();

  const loginUser = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setLogStatus(true);
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  const resetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert('Password reset email sent');
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to ARP Recipe List</Text>
      <Text style={styles.subtitle}>Please Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button title="Sign In" onPress={loginUser} color="green" />
        </View>
        <View style={styles.button}>
          <Button title="Forgot Password?" onPress={resetPassword} color="green" />
        </View>
        <View style={styles.button}>
          <Button title="Register" onPress={() => navigation.navigate('Register')} color="green" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    marginBottom: 7,
  },
});

export default LoginView;
