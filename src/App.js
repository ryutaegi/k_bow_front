import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableOpacity, Image, Text, ScrollView, AsyncStorage } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Dimensions } from 'react-native';
import Target_select from './Target_select.js';
import HomeMain from './HomeMain.js';
import boardlist from './home/notice_list.js';
import EquipmentMain from './EquipmentMain.js';
import MapMain from './MapMain.js';
import RecordMain from './RecordMain.js';
import MyPageMain from './MyPageMain.js';
import AuthStack from './stack/AuthStack';
import CreatePost from './home/CreatePost.js';
import Notice_detail from './home/Notice_detail.js';
import UpdatePost from './home/UpdatePost.js';
import DataMain from './record/DataMain.js';
import Record from './record/Record.js';
import TargetSelect from './record/TargetSelect.js';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { images } from './utils/images.js'
import {ThemeProvider} from 'styled-components/native';
import { theme } from './theme.js';
import { ProgressProvider, ProgressContext, UserProvider, UserContext } from './contexts';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabs, Icon } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';



const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const community = ['공지사항', '자유게시판', '정보게시판', '홍보게시판', '중고게시판'];


function HomeTab() {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <Stack.Navigator
    initialRouteName="board1"
    screenOptions={{
      cardStyle: { backgroundColor: theme.white },
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
    >
      <Stack.Screen 
        name="board1"
        component={HomeMain} 
        options={{title : '활로',
         headerShown : true}} 
      />
      <Stack.Screen 
        name="board2"
        component={boardlist} 
        options={({ route }) => ({
          title: community[route.params.board_type-1],
          headerShown: true,
          // headerRight: () => (
          //   <TouchableOpacity onPress={() => alert('Icon Pressed!')}>
          //     <Icon name="menu" size={30} color="#000" style={{ marginRight: 10 }} />
          //   </TouchableOpacity>
          // )
        })} 
        
      />
      <Stack.Screen 
        name="create_post"
        component={CreatePost} 
        options={{title : '게시글 쓰기', headerShown : true}} 
      />
      <Stack.Screen 
        name="update_post"
        component={UpdatePost} 
        options={{title : '게시글 수정', headerShown : true}} 
      />
      <Stack.Screen 
        name="notice_detail"
        options={{
          title : '게시글 상세', 
          headerShown : true,
          headerRight: () => (
            <MenuProvider>
              <TouchableOpacity onPress={() => {setModalVisible(true)}}>
                <Icon name="menu" size={30} color="#000" style={{ marginRight: 10, marginTop: 10 }} />
              </TouchableOpacity>
            </MenuProvider>
          ),
        }} 
      >
        {props => <Notice_detail {...props} modalVisible={modalVisible} setModalVisible={setModalVisible} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function RecordTab() {
  const { inProgress } = useContext(ProgressContext);
  const { user } = useContext(UserContext);
  const navigation = useNavigation(); // useNavigation hook to get the navigation prop

  const data = [
    { date: '2023-01-01', count: 5 },
    { date: '2023-01-02', count: 2 },
    // ... more data ...
  ];
  return (
    <>
      {user?.user_id ? 
        <Stack.Navigator 
          initialRouteName="RecordMain"
          screenOptions={{
            cardStyle: { backgroundColor: theme.white },
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="RecordMain" 
            component={RecordMain}
            options={{
              title : '시수 기록', 
              headerShown : true,
              headerRight: () => (              
                <TouchableOpacity 
                  style={{marginRight : 15}}
                  onPress={() => navigation.navigate('DataMain', {data : data})} // Navigate to DataMain when pressed
                >
                  <Entypo name="documents" size={30} color="black" />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen name="Target_select" component={Target_select} 
            options={{title : '시수 기록', headerShown : true}}/>
          <Stack.Screen name="DataMain" component={DataMain}
            options={{
              title : '월별 기록', headerShown : true,
            }}
          />
          <Stack.Screen name="Record" component={Record}
            options={{
              title : '일별 기록', headerShown : true,
              // headerRight: () => (
              //   <TouchableOpacity onPress={() => }>
              //     <Entypo name="save" size={30} color="#000" style={{ marginRight: 10 }} />
              //   </TouchableOpacity>
              // )
            }}
            
          />
           <Stack.Screen name="TargetSelect" component={TargetSelect}
            options={{
              title : '시수 기록', headerShown : true,
              
            }}
          />
        </Stack.Navigator>
      : <AuthStack />}
      {inProgress && <Spinner />}
    </>
  );
}







const App = () => {

  return(
    <SafeAreaView style={{ flex: 1 }}>
      <UserProvider>
<ProgressProvider>
      <ThemeProvider theme={theme}>
    <NavigationContainer style={{ paddingTop: StatusBar }}>
      <Tab.Navigator
        initialRouteName="활로"
        screenOptions={{
          tabBarActiveTintColor: theme.mainColor4,
          tabBarInactiveTintColor: "gray",
          tabBarStyle: { backgroundColor: '#fff', height: 55 },
          tabBarShowLabel: false,
          headerStyle: {
            backgroundColor: theme.white,
          },
          headerTintColor: theme.black,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Tab.Screen
          name="활로"
          component={HomeTab}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Icon name="home" color={color} size={26} type="font-awesome" />
            ),
          }}
        />
        <Tab.Screen
          name="시수 기록"
          component={RecordTab}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Icon name="pencil" color={color} size={26} type="font-awesome" />
            ),
          }}
        />
        <Tab.Screen
          name="활터 정보"
          component={MapMain}
          
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="map" color={color} size={26} type="font-awesome" />
            ),
          }}
        />
        <Tab.Screen
          name="장비"
          component={EquipmentMain}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="cog" color={color} size={26} type="font-awesome" />
            ),
          }}
        />
        <Tab.Screen
          name="내 정보"
          component={MyPageMain}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="user" color={color} size={26} type="font-awesome" />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
    </ThemeProvider>
    </ProgressProvider>
        </UserProvider>
  </SafeAreaView>
  )
};


export default App;
