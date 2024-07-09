// screens/MainView.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import PostsView from './PostsView';
import ProfileView from './ProfileView';

const Tab = createBottomTabNavigator();

const MainView = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Recipes" 
        component={PostsView}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant" color={color} size={size} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileView}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }} 
      />
    </Tab.Navigator>
  );
};

export default MainView;
