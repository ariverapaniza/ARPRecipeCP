// screens/RegisterView.tsx
import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../AuthContext';

const RegisterView = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [about, setAbout] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const { setLogStatus } = useContext(AuthContext);
  const auth = getAuth();
  const firestore = getFirestore();
  const storage = getStorage();

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        setImageBlob(blob);
      }
    } catch (error) {
      Alert.alert('Error', 'Image selection failed');
      console.error(error);
    }
  };

  const registerUser = async () => {
    if (!email || !password || !username || !fullName || !about) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        let profilePicURL = null;
        if (imageBlob) {
          const imageRef = ref(storage, `Profile_Images/${user.uid}_${Date.now()}`);
          await uploadBytes(imageRef, imageBlob);
          profilePicURL = await getDownloadURL(imageRef);
        }
        await setDoc(doc(firestore, 'Users', user.uid), {
          username,
          fullName,
          about,
          email,
          userUID: user.uid,
          profilePicURL,
        });
        setLogStatus(true);
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TouchableOpacity onPress={pickImage}>
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Text style={styles.imagePlaceholder}>Pick a profile picture</Text>
          )}
        </View>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="About You"
        value={about}
        onChangeText={setAbout}
        multiline
      />
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
      <Button title="Register" onPress={registerUser} color="green" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    lineHeight: 200,
  },
});

export default RegisterView;
