import React, {useState, useContext, useRef} from "react";
import { StyleSheet, View, Image, ScrollView, TouchableOpacity } from "react-native";
import { ButtonGroup } from '@rneui/themed'
import MapView from "react-native-maps";
import { Marker, Callout} from "react-native-maps";
import styled, {ThemeContext} from 'styled-components/native';
import { Text } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as Linking from 'expo-linking';


const Tab = createMaterialTopTabNavigator();

const MapMain = ({}) => {
  const theme = useContext(ThemeContext);
  const place_name = ["TAC 본점", "TAC 낙성대점", "TAC 이대점", "활쏘아", "주몽처럼"];
  const lat = [37.5632,  37.4765, 37.5563, 37.6339, 37.4757 ];
  const lon = [127.0166, 126.9655, 126.9478, 127.0710, 126.9642];
  const place_url = [
    'https://ugc.production.linktr.ee/cAQ3hlRcQBScXEWFix2o_29Z1EyJZCc1T0cbC?io=true&size=avatar',
    'https://ugc.production.linktr.ee/cAQ3hlRcQBScXEWFix2o_29Z1EyJZCc1T0cbC?io=true&size=avatar',
    'https://ugc.production.linktr.ee/cAQ3hlRcQBScXEWFix2o_29Z1EyJZCc1T0cbC?io=true&size=avatar',
    'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230605_71%2F16859632002013JGG0_JPEG%2FIMG_9542.jpeg',
    'https://www.heritage.go.kr/unisearch/images/imp_intangible_cult_prop/2020073010401300.jpg',
  ];
  const place_address = [
    '서울 중구 다산로42가길 36 지하1층',
    '서울 관악구 남부순환로 1949 금산빌딩 지하층 B-2호',
    '서울 마포구 대흥로30길 34 지1층',
    '서울 노원구 공릉로59가길 9 지층',
    '서울 관악구 남부순환로246길 18',
    
  ];
  const place_link = [
    'https://naver.me/5WcHKxHz',
    'https://naver.me/GVMorLvh',
    'https://naver.me/xw6qZRBR',
    'https://naver.me/FU94a13P',
    'https://naver.me/5lxx6kNp',
    
  ];

  const mapRef = useRef(null);
  const markerRefs = useRef([]);

  const moveMap = (index) => {
    const region = {
        latitude: lat[index], 
        longitude: lon[index], 
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };
    mapRef.current.animateToRegion(region, 500);  // 0.5초 동안 애니메이션

    setTimeout(() => {
      if (markerRefs.current[index]) {
          markerRefs.current[index].showCallout();
      }
  }, 500);
  };

  const link = (url) => {
    Linking.openURL(url)
}

  const Innerplace = () => {
    return (
      <>
      <MapView
          initialRegion={{
            latitude: 37.6334,
            longitude: 127.0781,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          ref={mapRef}
          style={Style.map}
        >
          {place_name.map((_, index) => (
          <Marker
          key ={index}
            coordinate={{
              latitude: lat[index],
              longitude: lon[index],
            }}
            //pinColor="#2D63E2"
          
            ref={(ref) => { markerRefs.current[index] = ref; }}
          >
             <Callout 
             onPress={() => link(place_link[index])}>
          <View>
      
            <Text style={{fontWeight : 'bold'}}>{place_name[index]} 
            <Text style={{fontSize : 13}}> 예약 {'>'}</Text></Text>
            
            <View style={{
            width : "40%",
            height : 2.5,
            marginBottom : 5,
            backgroundColor : theme.wiget22
          }}>

          </View>
          </View>
        </Callout>
          </Marker>
          ))}

        </MapView>
        
        <ScrollView>
          
        <View style={{
          width : "100%",
          paddingTop : 10,
          flexDirection : 'row',
          flexWrap : 'wrap',
          //backgroundColor : 'white',
        }}>
          
         { place_name.map((_, index) => (
          <TopBoardButton 
          key = {index}
          onPress={() => {moveMap(index)}}>
          
        <Image 
        source={{uri: place_url[index]}} 
        style={Style.image} 
      />
    
        <View style={{
          marginTop : -3,
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
            backgroundColor : theme.wiget22
          }}>

          </View>
          <Text style={Style.text}>
          {place_address[index]}
          </Text>
          </View>
          
          </TopBoardButton>
          ))}
          
          </View>
          </ScrollView>
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
           
          />
        </MapView>

        <BoardButton></BoardButton>
       
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
        tabBarStyle: {
            height: 35,   // 전체 탭바의 높이 조정
            
        },
        tabBarItemStyle: {
            height: 30,   // 개별 탭 아이템의 높이 조정
        },
        tabBarLabelStyle: {
            top : -7,
            fontSize: 12,  // 라벨의 폰트 크기 조정
            padding: 0,    // 라벨의 패딩 조정
        },
        tabBarIndicatorStyle: {
          height: 35,      // 인디케이터의 높이 설정
          backgroundColor: theme.wiget22,  // 인디케이터 색상 설정
          marginBottom: 0,   // 인디케이터의 위치 조정
      },
      tabBarActiveTintColor: 'white',    // 선택된 탭의 글자색 설정
        tabBarInactiveTintColor: 'gray',  // 선택되지 않은 탭의 글자색 설정
    }}
      >

        <Tab.Screen name="Thirdplace" component={Secondplace} 
        options={{
          title : '지역 활터',
        }}/>

        <Tab.Screen name="Secondplace" component={Secondplace} 
        options={{
          title : '공공 활터',
        }}/>
        
        <Tab.Screen name="Innerplace" component={Innerplace} 
        options={{
          cardStyle: { backgroundColor: theme.white },
          title : '실내 활터',
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
    top : 0,
    width: "100%",
    height: "45%",
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
    top : -3,
    width : '100%',
    height : '50%',
  }
});

const BoardButton = styled.TouchableOpacity`
  width: 95%; 
  height: 50px;
  //border : 1px solid ${({ theme }) => theme.gray5};
  
  background-color : ${({ theme }) => theme.white};
  border-radius : 10px;

  margin-left : 3px;
  margin-right : 3px;
  margin-bottom : 10px;
  overflow : hidden;

`;

const TopBoardButton = styled.TouchableOpacity`
  width: 130px; 
  height: 180px;
  //border : 1px solid ${({ theme }) => theme.gray5};
  
  background-color : ${({ theme }) => theme.white};
  border-radius : 10px;

  margin-left : 3px;
  margin-right : 3px;
  margin-bottom : 10px;
  overflow : hidden;

`;
export default MapMain;
