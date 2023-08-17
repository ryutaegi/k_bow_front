import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, Text, ScrollView, AsyncStorage } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Dimensions } from 'react-native';
import Target_select from './Target_select.js';
import HomeMain from './HomeMain.js';
import EquipmentMain from './EquipmentMain.js';
import MapMain from './MapMain.js';
import RecordMain from './RecordMain.js';
import MyPageMain from './MyPageMain.js';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { SafeAreaView } from 'react-native';
import { Icon } from 'react-native-elements';
import { StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { images } from './utils/images.js'
import {ThemeProvider} from 'styled-components/native';
import { theme } from './theme.js';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// const imageAssets=  cacheImages([
//   require('../assets/splash.png'),
//   ...Object.values(images),
// ]);


function HomeTab() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeMain"
        component={HomeMain} 
        options={{ headerTitle: '국궁' }} 
      />
    </Stack.Navigator>
  );
}

function RecordTab() {
  return (
    <Stack.Navigator 
    initialRouteName="RecordMain"
    >
    <Stack.Screen name="RecordMain" component={RecordMain}
    options={{title : '시수 기록', headerShown : false}}/>
    <Stack.Screen name="Target_select" component={Target_select} 
    options={{title : '시수 기록', headerShown : false}}/>
  </Stack.Navigator>
  );
}





const App = () => (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
    <NavigationContainer style={{paddingTop : StatusBar}}
    >
<Tab.Navigator
  initialRouteName="Home"
  screenOptions={{
    tabBarActiveTintColor: "#3b5998", // use this for activeColor
    tabBarInactiveTintColor: "gray",  // use this for inactiveColor
    tabBarStyle: { backgroundColor: '#fff', height : 55}, // use this for barStyle
    tabBarShowLabel: false, // use this for showLabel
  }}
>
        <Tab.Screen
          name="홈"
          component={HomeMain}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="home" color={color} size={26} type="font-awesome" /> // 변경된 부분
            ),
           
          }}
          
        />
        <Tab.Screen
          name="시수 기록"
          component={RecordTab}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="pencil" color={color} size={26} type="font-awesome" /> // 변경된 부분
            ),
          
          }}
        />
        <Tab.Screen
          name="지도"
          component={MapMain}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="map" color={color} size={26} type="font-awesome" /> // 변경된 부분
            ),
           
          }}
        />
        <Tab.Screen
          name="장비"
          component={EquipmentMain}
          options={{
           
            tabBarIcon: ({ color }) => (
              <Icon name="cog" color={color} size={26} type="font-awesome" /> // 변경된 부분
            ),
           
          }}
        />
        <Tab.Screen
          name="내 정보"
          component={MyPageMain}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="user" color={color} size={26} type="font-awesome" /> // 변경된 부분
            ),
          
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
    </ThemeProvider>
  </SafeAreaView>
  );


export default App;
