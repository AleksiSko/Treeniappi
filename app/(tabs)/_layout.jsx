import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import HomeIcon from 'react-native-vector-icons/Ionicons';
import HistoryIcon from 'react-native-vector-icons/MaterialIcons';
import ChartIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const Layout = () => {
  return (
    <>
      {/* Yläreunan peittävä komponentti */}
      <View style={styles.topOverlay} />

      {/* Tab-navigaatio */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: -35,
            backgroundColor: '#1E1E1E',
            borderTopWidth: 0,
            height: 70,
          },
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'gray',
        }}
      >
        
        <Tabs.Screen
          name="historypage"
          options={{
            title: 'Historia',
            tabBarIcon: ({ color, size, focused }) => (
              <HistoryIcon name="history" color = {focused ? 'white' : 'grey'}  size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Koti',
            tabBarIcon: ({ color, focused, size }) => (
              <HomeIcon name="home" color = {focused ? 'white' : 'grey'} size = {size} />
            ),
          }}
        />
        <Tabs.Screen
          name="progresspage"
          options={{
            title: 'Edistyminen',
            tabBarIcon: ({ color, size, focused }) => (
              <ChartIcon name="chart-line" color = {focused ? 'white' : 'grey'}  size={size} />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default Layout;

const styles = StyleSheet.create({
  topOverlay: {
    position: 'absolute',
    top: 0,
    height: Platform.OS === 'ios' ? 54 : StatusBar.currentHeight || 24,
    width: '100%',
    backgroundColor: '#1E1E1E',
    zIndex: 1000,
  },
});
