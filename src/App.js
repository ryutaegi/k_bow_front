import React, { useState, useEffect, useContext, useInsertionEffect } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import axios from 'axios';
import PopupModal from './components/PopupModal';
import getEnvVars from '../environmant';
import jwtDecode from 'jwt-decode';
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
import GroupBoard from "./home/group/GroupBoard.js";
import GroupBoardDetail from "./home/group/GroupBoardDetail.js";
import GroupBoardCreate from "./home/group/GroupBoardCreate.js";
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

// 전역 텍스트 줄바꿈: 띄어쓰기 기준으로 (한국어 포함)
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.lineBreakStrategyIOS = 'hangul-word';

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
      <View style={{ flexDirection: 'row', alignItems: 'center', height : 30 }}>
        <Image
          source={require('../images/logo3.png')} // 로고 이미지 경로
          style={{ resizeMode : 'contain', width : 30,  marginRight: 15, }}
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
        options={{ headerTitle: () => <LogoTitle />, headerTitleAlign: 'left', }}
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
      <Stack.Screen
        name="GroupBoard"
        component={GroupBoard}
        options={({ route }) => ({ title: route.params.group_name + ' 게시판', headerShown: true })}
      />
      <Stack.Screen
        name="GroupBoardDetail"
        component={GroupBoardDetail}
        options={{ title: "게시글 상세", headerShown: true }}
      />
      <Stack.Screen
        name="GroupBoardCreate"
        component={GroupBoardCreate}
        options={{ title: "게시글 쓰기", headerShown: true }}
      />
    </Stack.Navigator>
  );
}

function RecordTab() {
  const { inProgress } = useContext(ProgressContext);
  const { user } = useContext(UserContext);
  const navigation = useNavigation(); // useNavigation hook to get the navigation prop

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
                    navigation.navigate("DataMain")
                  }
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
          // 토큰 만료 시 저장된 데이터 삭제
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userInfo');
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

// x.y.z 버전 문자열 비교: a < b 이면 true
const isVersionLower = (a, b) => {
  const pa = String(a).split('.').map(Number);
  const pb = String(b).split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const na = pa[i] ?? 0;
    const nb = pb[i] ?? 0;
    if (na < nb) return true;
    if (na > nb) return false;
  }
  return false;
};

const AppInner = () => {
  const { inProgress } = useContext(ProgressContext);
  const [popup, setPopup] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    const fetchPopup = async () => {
      try {
        const res = await axios.get(`${getEnvVars.apiUrl}/api/popup`);
        const data = res.data?.popup;
        if (!data) return;

        if (data.type === 'force_update') {
          const appVersion = Constants.expoConfig?.version ?? '0.0.0';
          if (data.min_version && isVersionLower(appVersion, data.min_version)) {
            setPopup(data);
            setPopupVisible(true);
          }
        } else {
          // 오늘 이미 닫은 팝업인지 확인
          const key = `popup_dismissed_${data.popup_id}`;
          const dismissed = await AsyncStorage.getItem(key);
          const today = new Date().toDateString();
          if (dismissed !== today) {
            setPopup(data);
            setPopupVisible(true);
          }
        }
      } catch (e) {
        // 팝업 실패는 조용히 무시
      }
    };
    fetchPopup();
  }, []);

  const handleClose = () => setPopupVisible(false);

  const handleDismissToday = async () => {
    if (popup) {
      const key = `popup_dismissed_${popup.popup_id}`;
      await AsyncStorage.setItem(key, new Date().toDateString());
    }
    setPopupVisible(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer style={{ paddingTop: StatusBar }}>
        <Auth />
      </NavigationContainer>
      {inProgress && <Spinner />}
      <PopupModal
        visible={popupVisible}
        popup={popup}
        onClose={handleClose}
        onDismissToday={handleDismissToday}
      />
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <UserProvider>
        <ProgressProvider>
          <AppInner />
        </ProgressProvider>
      </UserProvider>
    </SafeAreaView>
  );
};

export default App;
