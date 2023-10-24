import React, {useState, useContext} from "react";
import { StyleSheet, View, Image } from "react-native";
import { ButtonGroup } from '@rneui/themed'
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import styled, {ThemeContext} from 'styled-components/native';
import { Text } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as Linking from 'expo-linking';


const Tab = createMaterialTopTabNavigator();

const MapMain = ({}) => {
  const theme = useContext(ThemeContext);
  const place_name = ["TAC 본점", "TAC 낙성대점", "활쏘아"];
  const place_url = [
    'https://ugc.production.linktr.ee/cAQ3hlRcQBScXEWFix2o_29Z1EyJZCc1T0cbC?io=true&size=avatar',
    'https://ugc.production.linktr.ee/cAQ3hlRcQBScXEWFix2o_29Z1EyJZCc1T0cbC?io=true&size=avatar',
    'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230605_71%2F16859632002013JGG0_JPEG%2FIMG_9542.jpeg',
  ];
  const place_address = [
    '서울 중구 다산로42가길 36 지하1층',
    '서울 관악구 남부순환로 1949 금산빌딩 지하층 B-2호',
    '서울 노원구 공릉로59가길 9 지층',
  ];
  const place_link = [
    'https://naver.me/5WcHKxHz',
    'https://naver.me/GVMorLvh',
    'https://naver.me/FU94a13P',
  ];

  const link = (url) => {
    Linking.openURL(url)
}

  const Firstplace = () => {
    return (
      <>
        <View style={{
          width : "100%",
          paddingTop : 10,
          flexDirection : 'row',
          flexWrap : 'wrap',
        }}>
         { place_name.map((_, index) => (
          <TopBoardButton 
          key = {index}
          onPress={() => {link(place_link[index])}}>
          <View style={{
            width : "100%",
            height : "50%",
          }}>
        <Image 
        source={{uri: place_url[index]}} 
        style={Style.image} 
      />
      </View>
        <View style={{
          paddingLeft : 8,
          paddingRight : 8,
          paddingBottom : 10,
        }}>
        <View style={{
          flexDirection: 'row',          // 행 방향으로 요소를 배치합니다.
          justifyContent: 'space-between', // 요소 사이에 가능한 한 많은 공간을 두어 요소를 양 끝에 정렬합니다.
          alignItems: 'center',          // 요소를 수직 중앙에 정렬합니다. (선택 사항)
      
        }}>
        <Text style={Style.title}>
          {place_name[index]}
          </Text>

          {/* <View style={{
            width : 12,
            height : 12,
            borderRadius : 10,
            marginTop : 7,
            marginRight : 0,
            backgroundColor : 'rgb(50,200,50)',
          }}>

          </View> */}
          
          </View>
          <View style={{
            width : "30%",
            height : 2.5,
            marginBottom : 5,
            backgroundColor : 'rgb(0,0,200)'
          }}>

          </View>
          <Text style={Style.text}>
          {place_address[index]}
          </Text>
          </View>
          
          </TopBoardButton>
          ))}
          
          </View>
          </>
    );
  }
  
  const Secondplace = () => {
    return (
        <View style={Style.container}>
        <MapView
          initialRegion={{
            latitude: 37.6334,
            longitude: 127.0781,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          style={Style.map}
        >
          <Marker
            coordinate={{
              latitude: 37.6334,
              longitude: 127.0781,
            }}
            //pinColor="#2D63E2"
            title="붕어방"
            description="다이빙 명소"
          />
        </MapView>
      </View>
      
    );
  }

  return (
    <>      
      <Tab.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: theme.white },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
        <Tab.Screen name="Firstplace" component={Firstplace} 
        options={{
          cardStyle: { backgroundColor: theme.white },
          title : '실내 활터',
        }}/>
        <Tab.Screen name="Secondplace" component={Secondplace} 
        options={{
          title : '공공 활터',
        }}/>
        <Tab.Screen name="Thirdplace" component={Secondplace} 
        options={{
          title : '지역 활터',
        }}/>
        {/* ... 다른 화면들 ... */}
      </Tab.Navigator>
    
    </>
  );
};
const Style = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "50%",
  },
  title : {
    marginTop : 5,
    fontSize : 15,
    fontWeight : 'bold',
    color : '#000',
    textAlign : 'left',
  },
  text : {
    fontSize : 11,
    color : '#000',
  },
  image : {
    width : '100%',
    height : '100%',
  }
});

const TopBoardButton = styled.TouchableOpacity`
  width: 130px; 
  height: 180px;
  border : 1px solid ${({ theme }) => theme.gray5};
  justify-content: center;
  background-color : ${({ theme }) => theme.white};
  border-radius : 10px;

  margin-left : 3px;
  margin-right : 3px;
  margin-bottom : 10px;
  overflow : hidden;

`;
export default MapMain;
