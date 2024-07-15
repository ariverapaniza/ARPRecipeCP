// screens/PostsView.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, Button, StyleSheet, RefreshControl } from 'react-native';
import { getFirestore, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import PostCard from '../components/PostCard';

const PostsView = () => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const firestore = getFirestore();
  const navigation = useNavigation();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    const q = query(collection(firestore, 'Recipes'), orderBy('publishedDate', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setPosts(fetchedPosts);
    });

    return unsubscribe;
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <Button title="Create New Post" onPress={() => navigation.navigate('CreateNewPost')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PostsView;
