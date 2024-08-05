// components/ProfileContent.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { User } from '../types';

const ProfileContent = ({ user }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{user.username}</Text>
      <Text style={styles.text}>{user.fullName}</Text>
      <Text style={styles.text}>{user.aboutYou}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
  },
});

export default ProfileContent;
