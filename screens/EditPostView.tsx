// screens/EditPostView.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Image } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

const EditPostView = ({ route, navigation }) => {
  const { post } = route.params;
  const [postText, setPostText] = useState(post.text);
  const [imageUri, setImageUri] = useState(post.imageURL);
  const [imageBlob, setImageBlob] = useState(null);
  const auth = getAuth();
  const firestore = getFirestore();
  const storage = getStorage();

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
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

  const updatePost = async () => {
    if (!postText) {
      Alert.alert('Error', 'Post text is required');
      return;
    }

    const user = auth.currentUser;
    const postRef = doc(firestore, 'Recipes', post.id);
    let updatedPost = {
      text: postText,
      userName: post.userName,
      userUID: post.userUID,
      publishedDate: post.publishedDate,
    };

    if (imageBlob) {
      const imageRef = ref(storage, `Recipe_Images/${user.uid}_${Date.now()}`);
      try {
        await uploadBytes(imageRef, imageBlob);
        const downloadURL = await getDownloadURL(imageRef);
        updatedPost.imageURL = downloadURL;
      } catch (error) {
        Alert.alert('Error', 'Image upload failed');
        console.error(error);
        return;
      }
    } else {
      updatedPost.imageURL = post.imageURL;
    }

    try {
      await updateDoc(postRef, updatedPost);
      Alert.alert('Post updated successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Edit your recipe"
        value={postText}
        onChangeText={setPostText}
        multiline
      />
      <Button title="Pick an image" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Button title="Update Post" onPress={updatePost} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
});

export default EditPostView;
