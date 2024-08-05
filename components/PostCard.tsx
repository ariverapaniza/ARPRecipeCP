// components/PostCard.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { format } from 'date-fns';
import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove, getDoc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const PostCard = ({ post }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userProfilePicURL, setUserProfilePicURL] = useState(post.userProfilePicURL);
  const auth = getAuth();
  const firestore = getFirestore();
  const navigation = useNavigation();

  const formattedDate = format(post.publishedDate.toDate(), 'PPpp');
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser && post.favorites && post.favorites.includes(currentUser.uid)) {
      setIsFavorite(true);
    }
  }, [currentUser, post.favorites]);

  useEffect(() => {
    const fetchUserProfilePic = async () => {
      const userDoc = await getDoc(doc(firestore, 'Users', post.userUID));
      if (userDoc.exists()) {
        setUserProfilePicURL(userDoc.data().profilePicURL || null);
      }
    };

    fetchUserProfilePic();
  }, [post.userUID]);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(firestore, 'Recipes', post.id), (doc) => {
      const updatedPost = doc.data();
      if (updatedPost && updatedPost.favorites) {
        setIsFavorite(updatedPost.favorites.includes(currentUser.uid));
      }
    });

    return () => unsubscribe();
  }, [post.id]);

  const handleToggleFavorite = async () => {
    try {
      const postRef = doc(firestore, 'Recipes', post.id);
      const userRef = doc(firestore, 'Users', currentUser.uid);

      if (isFavorite) {
        await updateDoc(postRef, {
          favorites: arrayRemove(currentUser.uid),
        });
        await updateDoc(userRef, {
          favorites: arrayRemove(post.id),
        });
        setIsFavorite(false);
      } else {
        await updateDoc(postRef, {
          favorites: arrayUnion(currentUser.uid),
        });
        await updateDoc(userRef, {
          favorites: arrayUnion(post.id),
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error updating favorites: ', error);
    }
  };

  const handleDeletePost = async () => {
    try {
      if (post.imageURL) {
        const imageRef = ref(storage, post.imageURL);
        await deleteObject(imageRef);
      }
      await deleteDoc(doc(firestore, 'Recipes', post.id));
      Alert.alert('Post deleted successfully');
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

  return (
    <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { post })}>
      <View style={styles.card}>
        <View style={styles.header}>
          {userProfilePicURL && (
            <Image source={{ uri: userProfilePicURL }} style={styles.profileImage} />
          )}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{post.userName}</Text>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>
          {currentUser?.uid === post.userUID && (
            <Menu>
              <MenuTrigger>
                <TouchableOpacity onPress={() => setMenuVisible(true)}>
                  <Text style={styles.menuTrigger}>⋮</Text>
                </TouchableOpacity>
              </MenuTrigger>
              <MenuOptions>
                <MenuOption onSelect={confirmDeletePost} text='Delete' />
              </MenuOptions>
            </Menu>
          )}
        </View>
        <Text style={styles.text}>{post.text}</Text>
        {post.imageURL && <Image source={{ uri: post.imageURL }} style={styles.image} />}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleToggleFavorite}>
            <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={24} color={isFavorite ? 'red' : 'black'} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
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
  menuTrigger: {
    fontSize: 18,
    color: '#666',
    padding: 5,
  },
  text: {
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default PostCard;
