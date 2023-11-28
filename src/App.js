import React, { useState, useEffect, useContext, useInsertionEffect } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
} from "react-native";
import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Dimensions } from "react-native";
import Target_select from "./Target_select.js";
import HomeMain from "./HomeMain.js";
import boardlist from "./home/notice_list.js";
import EquipmentMain from "./EquipmentMain.js";
import MapMain from "./MapMain.js";
import RecordMain from "./RecordMain.js";
import MyPageMain from "./MyPageMain.js";
import AuthStack from "./stack/AuthStack";
import CreatePost from "./home/CreatePost.js";
import Notice_detail from "./home/Notice_detail.js";
import UpdatePost from "./home/UpdatePost.js";
import DataMain from "./record/DataMain.js";
import Record from "./record/Record.js";
import TargetSelect from "./record/TargetSelect.js";
import GroupMain from "./home/group/GroupMain.js";
import GroupAdd from "./home/group/GroupAdd.js";
import GroupDetail from "./home/group/GroupDetail.js";
import GroupMake from "./home/group/GroupMake.js";
import JoinPresenter from "./mypage/JoinPresenter.js";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { SafeAreaView } from "react-native";
import { StatusBar } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { images } from "./utils/images.js";
import { ThemeProvider } from "styled-components/native";
import { theme } from "./theme.js";
import {
  ProgressProvider,
  ProgressContext,
  UserProvider,
  UserContext,
} from "./contexts";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from "react-native-popup-menu";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BottomTabs, Icon } from "react-native-elements";
import { FontAwesome } from "@expo/vector-icons";
import { Spinner } from "./components";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const community = [
  "공지사항",
  "자유게시판",
  "정보게시판",
  "홍보게시판",
  "중고게시판",
];

function HomeTab() {
  const navigation = useNavigation(); // useNavigation hook to get the navigation prop
  const [modalVisible, setModalVisible] = useState(false);

  function LogoTitle() {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={require('../images/logo3.png')} // 로고 이미지 경로
          style={{ resizeMode : 'contain', width : 30, marginRight: 15, }}
        />
        <Text style={{fontSize : 22, fontWeight : 'bold'}}>활 로</Text>
      </View>
    );
  }


  return (
    <Stack.Navigator
      initialRouteName="홈"
      screenOptions={{
        cardStyle: { backgroundColor: theme.white },
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="홈"
        component={HomeMain}
        options={{ headerTitle: () => <LogoTitle />, headerShown: true, headerTitleAlign: 'left', }}
      />
      <Stack.Screen
        name="board2"
        component={boardlist}
        options={({ route }) => ({
          title: community[route.params.board_type - 1],
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
        options={{ title: "게시글 쓰기", headerShown: true }}
      />
      <Stack.Screen
        name="update_post"
        component={UpdatePost}
        options={{ title: "게시글 수정", headerShown: true }}
      />
      <Stack.Screen
        name="notice_detail"
        options={{
          title: "게시글 상세",
          headerShown: true,
          
        }}
      >
        {(props) => (
          <Notice_detail
            {...props}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="GroupMain"
        component={GroupMain}
        options={{ title: "그룹이름", headerShown: true }}
      />

      <Stack.Screen
        name="GroupAdd"
        component={GroupAdd}
        options={{
          title: "그룹 추가",
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => navigation.navigate("GroupMake")} // Navigate to DataMain when pressed
            >
              <Ionicons name="add" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="GroupDetail"
        component={GroupDetail}
        options={{ title: "그룹 상세", headerShown: true }}
      />

      <Stack.Screen
        name="GroupMake"
        component={GroupMake}
        options={{ title: "그룹 생성", headerShown: true }}
      />
    </Stack.Navigator>
  );
}

function RecordTab() {
  const { inProgress } = useContext(ProgressContext);
  const { user } = useContext(UserContext);
  const navigation = useNavigation(); // useNavigation hook to get the navigation prop

  const data = [
    { date: "2023-01-01", count: 5 },
    { date: "2023-01-02", count: 2 },
    // ... more data ...
  ];
  return (
    <>
      
        <Stack.Navigator
          initialRouteName="RecordMain"
          screenOptions={{
            cardStyle: { backgroundColor: theme.white },
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
          <Stack.Screen
            name="RecordMain"
            component={RecordMain}
            options={{
              title: "시수 기록",
              headerShown: true,
              headerRight: () => (
                <TouchableOpacity
                  style={{ marginRight: 15 }}
                  onPress={() =>
                    navigation.navigate("DataMain", { data: data })
                  } // Navigate to DataMain when pressed
                >
                  <Entypo name="documents" size={30} color="black" />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="Target_select"
            component={Target_select}
            options={{ title: "시수 기록", headerShown: true }}
          />
          <Stack.Screen
            name="DataMain"
            component={DataMain}
            options={{
              title: "월별 기록",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="Record"
            component={Record}
            options={{
              title: "일별 기록",
              headerShown: true,
              // headerRight: () => (
              //   <TouchableOpacity onPress={() => }>
              //     <Entypo name="save" size={30} color="#000" style={{ marginRight: 10 }} />
              //   </TouchableOpacity>
              // )
            }}
          />
          <Stack.Screen
            name="TargetSelect"
            component={TargetSelect}
            options={{
              title: "시수 기록",
              headerShown: true,
            }}
          />
        </Stack.Navigator>
      {inProgress && <Spinner />}
    </>
  );
}

const Auth = () => {
  const { user } = useContext(UserContext);
  const { dispatch } = useContext(UserContext);

  const checkTokenAndDispatch = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // 현재 시간을 초 단위로 변환
  
        // 토큰의 만료 시간이 현재 시간보다 이후인지 확인
        if (decodedToken.exp > currentTime) {
          const userInfo = await AsyncStorage.getItem('userInfo');
          if (userInfo) {
            const parsedUserInfo = JSON.parse(userInfo);
            dispatch({
              ...parsedUserInfo,
              jwtToken: token
            });
            console.log("토큰 확인됨");
            console.log(parsedUserInfo);
          }
        } else {
          console.log("토큰 만료됨");
          // 토큰이 만료되었을 때의 처리를 여기에 작성하세요.
        }
      }
    } catch (error) {
      console.log('토큰 확인 중 오류 발생: ', error);
    }
  }; 

  
  useEffect(() => {
    checkTokenAndDispatch()
  },[]);

  return (user?.user_id ?
      (user.agree==0 ? <JoinPresenter/> : 
        <Tab.Navigator
          initialRouteName="활로"
          screenOptions={{
            tabBarActiveTintColor: theme.wiget22,
            tabBarInactiveTintColor: "gray",
            tabBarStyle: { backgroundColor: "#fff", height: 50 },
            tabBarShowLabel: false,
            headerStyle: {
              backgroundColor: theme.white,
              
            },
            headerTintColor: theme.black,
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
          <Tab.Screen
            name="활로"
            component={HomeTab}
            options={{
              headerShown: false,
              tabBarIcon: ({ color }) => (
                <Icon
                  name="home"
                  color={color}
                  size={26}
                  type="font-awesome"
                />
              ),
            }}
          />
          <Tab.Screen
            name="시수 기록"
            component={RecordTab}
            options={{
              headerShown: false,
              tabBarIcon: ({ color }) => (
                <Icon
                  name="pencil"
                  color={color}
                  size={26}
                  type="font-awesome"
                />
              ),
            }}
          />
          <Tab.Screen
            name="활터 정보"
            component={MapMain}
            options={{
              tabBarIcon: ({ color }) => (
                <Icon
                  name="map"
                  color={color}
                  size={26}
                  type="font-awesome"
                />
              ),
            }}
          />
          <Tab.Screen
            name="장비"
            component={EquipmentMain}
            options={{
              tabBarIcon: ({ color }) => (
                <Icon
                  name="cog"
                  color={color}
                  size={26}
                  type="font-awesome"
                />
              ),
            }}
          />
          <Tab.Screen
            name="내 정보"
            component={MyPageMain}
            options={{
              tabBarIcon: ({ color }) => (
                <Icon
                  name="user"
                  color={color}
                  size={26}
                  type="font-awesome"
                />
              ),
            }}
          />
        </Tab.Navigator>
        ) : <AuthStack />)
  
}

const App = () => {
  const { inProgress } = useContext(ProgressContext);
  
  

  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <UserProvider>
        <ProgressProvider>
          <ThemeProvider theme={theme}>
            <NavigationContainer style={{ paddingTop: StatusBar }}>
            <Auth/>
            </NavigationContainer>
          </ThemeProvider>
        </ProgressProvider>
      </UserProvider>
      {inProgress && <Spinner />}
    </SafeAreaView>
  );
};

export default App;
