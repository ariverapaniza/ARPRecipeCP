// screens/ProfileView.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, FlatList, TouchableOpacity, Alert, TextInput, RefreshControl } from 'react-native';
import { getAuth, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, query, where, orderBy, updateDoc, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import PostCard from '../components/PostCard';

const ProfileView = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [favoritePosts, setFavoritePosts] = useState([]);
  const [imageUri, setImageUri] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [about, setAbout] = useState('');
  const auth = getAuth();
  const firestore = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    fetchUserData();
    const unsubscribeUserPosts = fetchUserPosts();
    const unsubscribeFavoritePosts = fetchFavoritePosts(user?.favorites || []);

    return () => {
      if (unsubscribeUserPosts) unsubscribeUserPosts();
      if (unsubscribeFavoritePosts) unsubscribeFavoritePosts();
    };
  }, []);

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDoc = await getDoc(doc(firestore, 'Users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser(userData);
        setFullName(userData.fullName);
        setAbout(userData.about);
        fetchFavoritePosts(userData.favorites || []);
      }
    }
  };

  const fetchUserPosts = () => {
    const user = auth.currentUser;
    if (user) {
      const q = query(
        collection(firestore, 'Recipes'),
        where('userUID', '==', user.uid),
        orderBy('publishedDate', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedPosts = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setUserPosts(fetchedPosts);
      });

      return unsubscribe;
    }
  };

  const fetchFavoritePosts = (favorites) => {
    if (favorites.length > 0) {
      const favPostsQuery = query(collection(firestore, 'Recipes'), where('__name__', 'in', favorites));
      const unsubscribe = onSnapshot(favPostsQuery, (snapshot) => {
        const favPosts = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setFavoritePosts(favPosts);
      });

      return unsubscribe;
    } else {
      setFavoritePosts([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  };

  const logOutUser = () => {
    signOut(auth).then(() => {
      navigation.replace('Login');
    }).catch((error) => {
      console.error('Error signing out: ', error);
    });
  };

  const resetPassword = () => {
    const user = auth.currentUser;
    if (user) {
      sendPasswordResetEmail(auth, user.email)
        .then(() => {
          Alert.alert('Password reset email sent');
        })
        .catch((error) => {
          Alert.alert('Error', error.message);
        });
    }
  };

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
        uploadProfilePicture(blob);
      }
    } catch (error) {
      Alert.alert('Error', 'Image selection failed');
      console.error(error);
    }
  };

  const uploadProfilePicture = async (blob) => {
    const user = auth.currentUser;
    const imageRef = ref(storage, `Profile_Images/${user.uid}_${Date.now()}`);
    try {
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);
      await updateDoc(doc(firestore, 'Users', user.uid), { profilePicURL: downloadURL });
      setUser({ ...user, profilePicURL: downloadURL });
      Alert.alert('Profile picture updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Profile picture upload failed');
      console.error(error);
    }
  };

  const updateProfile = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(firestore, 'Users', user.uid), {
          fullName,
          about,
        });
        Alert.alert('Profile updated successfully');
        fetchUserData(); // Refresh user data after update
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      console.error(error);
    }
  };

  const renderProfileHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Profile</Text>
      <TouchableOpacity onPress={pickImage}>
        <View style={styles.profileImageContainer}>
          {user?.profilePicURL ? (
            <Image source={{ uri: user.profilePicURL }} style={styles.profileImage} />
          ) : (
            <Text style={styles.imagePlaceholder}>Add Profile Picture</Text>
          )}
        </View>
      </TouchableOpacity>
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <Text style={styles.label}>About You</Text>
      <TextInput
        style={styles.input}
        placeholder="About You"
        value={about}
        onChangeText={setAbout}
        multiline
      />
      <View style={styles.buttonContainer}>
        <Button title="Update Profile" onPress={updateProfile} color="green" />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Reset Password" onPress={resetPassword} color="green" />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Log Out" onPress={logOutUser} color="red" />
      </View>
      <Text style={styles.sectionTitle}>Recipes</Text>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text>No recipes found.</Text>
    </View>
  );

  const renderFavouritesHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.sectionTitle}>Favourites</Text>
    </View>
  );

  const renderFavoriteEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text>No favourites found.</Text>
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={renderProfileHeader}
      data={userPosts}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <PostCard post={item} />}
      ListEmptyComponent={renderEmptyComponent}
      ListFooterComponent={() => (
        <>
          {renderFavouritesHeader()}
          <FlatList
            data={favoritePosts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <PostCard post={item} />}
            ListEmptyComponent={renderFavoriteEmptyComponent}
            contentContainerStyle={styles.favoritesContainer}
          />
        </>
      )}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  favoritesContainer: {
    paddingBottom: 20,
  },
});

export default ProfileView;
