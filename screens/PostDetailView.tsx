// screens/PostDetailView.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, StyleSheet, Alert } from 'react-native';
import { getFirestore, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, deleteObject } from 'firebase/storage';

const PostDetailView = ({ route, navigation }) => {
  const { post } = route.params;
  const [userProfilePicURL, setUserProfilePicURL] = useState(post.userProfilePicURL);
  const firestore = getFirestore();
  const storage = getStorage();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUserProfilePic = async () => {
      const userDoc = await getDoc(doc(firestore, 'Users', post.userUID));
      if (userDoc.exists()) {
        setUserProfilePicURL(userDoc.data().profilePicURL || null);
      }
    };

    fetchUserProfilePic();
  }, [post.userUID]);

  const handleDeletePost = async () => {
    try {
      if (post.imageURL) {
        const imageRef = ref(storage, post.imageURL);
        await deleteObject(imageRef);
      }
      await deleteDoc(doc(firestore, 'Recipes', post.id));
      Alert.alert('Post deleted successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete post');
      console.error(error);
    }
  };

  const confirmDeletePost = () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: handleDeletePost }
      ]
    );
  };

  const handleEditPost = () => {
    navigation.navigate('EditPost', { post });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {userProfilePicURL && (
          <Image source={{ uri: userProfilePicURL }} style={styles.profileImage} />
        )}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{post.userName}</Text>
          <Text style={styles.date}>{new Date(post.publishedDate.seconds * 1000).toLocaleString()}</Text>
        </View>
      </View>
      <Text style={styles.text}>{post.text}</Text>
      {post.imageURL && <Image source={{ uri: post.imageURL }} style={styles.image} />}
      {currentUser?.uid === post.userUID && (
        <>
          <Button title="Edit Recipe" onPress={handleEditPost} color="green" />
          <Button title="Delete" color="red" onPress={confirmDeletePost} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  userInfo: {
    flexDirection: 'column',
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  text: {
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
  },
});

export default PostDetailView;
