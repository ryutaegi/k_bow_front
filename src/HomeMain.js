import React, { useContext, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TextInput, Button, FlatList } from 'react-native';
import axios from 'axios';
import { Card, Text, ListItem } from 'react-native-elements';
import styled, {ThemeContext} from 'styled-components/native';
import { Fontisto } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';


const HomeMain = ( {navigation} ) => {
  const theme = useContext(ThemeContext);
    return (
      <ScrollView showsHorizontalScrollIndicator={false}>
      <View style={{height : theme.viewHeight*0.23}}>
      <ScrollView style={Style.scrollstyle} horizontal={true} showsHorizontalScrollIndicator={false}>
      
      <TopBoardButton><Text style={Style.text}>활린이 길잡이</Text></TopBoardButton>
      <TopBoardButton><Text style={Style.text}>긴급 공지</Text></TopBoardButton>
      <TopBoardButton><Text style={Style.text}>가까운 대회</Text></TopBoardButton>
      </ScrollView>
      </View>
      {/* <__menuButton>
      <_menuButton style={{backgroundColor : theme.white}}></_menuButton>
      <_menuButton style={{backgroundColor : theme.white}}></_menuButton>
      <_menuButton style={{backgroundColor : theme.white}}></_menuButton>
      <_menuButton style={{backgroundColor : theme.white}}></_menuButton>
      </__menuButton> */}

      <__communityButton>
      
        <CommunityText>
          <CommunityText1>
            전체 게시판</CommunityText1>
            </CommunityText>
        <HorizontalLine/>
      <CommunityList
        onPress={() => navigation.navigate('board2', {board_type:1})}
        >
        <Text>공지사항</Text>
        
       </CommunityList>
       
      <CommunityList 
      onPress={() => navigation.navigate('board2', {board_type:2})}
      >
      <Text>자유게시판</Text>
      </CommunityList>

      <CommunityList 
      onPress={() => navigation.navigate('board2', {board_type:3})}
      >
      <Text>정보게시판</Text>
      </CommunityList>

      <CommunityList 
      onPress={() => navigation.navigate('board2', {board_type:4})}
      >
      <Text>홍보게시판</Text>
      </CommunityList>

      <CommunityList 
      onPress={() => navigation.navigate('board2', {board_type:5})}
      >
      <Text>중고게시판</Text>
      </CommunityList>

      </__communityButton>

      <__communityButton>
      <CommunityText>
        <CommunityText1>  그룹</CommunityText1>
        <Text style={{color:'blue'}}>추가하기 <Ionicons name="add" size={16} color="blue" /></Text>
        </CommunityText>
      <HorizontalLine/>
      <CommunityList
        onPress={() => navigation.navigate('board2', {board_type:6})}
        >
        <Text>서울과학기술대학교 어의궁</Text>
       </CommunityList>
       <CommunityList
        onPress={() => navigation.navigate('board2', {board_type:6})}
        >
        <Text>동국대학교 명궁</Text>
       </CommunityList>
       
       <CommunityList
        onPress={() => navigation.navigate('board2', {board_type:6})}
        >
        <Text>광운대학교 천운</Text>
       </CommunityList>
       
       <CommunityList
        onPress={() => navigation.navigate('board2', {board_type:6})}
        >
        <Text>서울대학교 설궁</Text>
       </CommunityList>
       
       <CommunityList
        onPress={() => navigation.navigate('board2', {board_type:6})}
        >
        <Text>한양대학교 심궁회</Text>
       </CommunityList>
       
       
      </__communityButton>
       
      </ScrollView>
    );
};



const Style = StyleSheet.create({
  scrollstyle : {
    marginTop : 20,
    //borderWidth : 1,
    width : '100%',
  },
  text : {
    fontSize : 15,
    fontWeight : 500,
    color : '#000',
  }
})


const TopBoardButton = styled.TouchableOpacity`
  width: 150px; 
  height: 150px;
  border : 1px solid ${({ theme }) => theme.gray5};
  justify-content: center;
  background-color : ${({ theme }) => theme.white};
  border-radius : 10px;
  align-items: center;
  margin-left : 15px;
  margin-right : 5px;

`;

const __menuButton = styled.TouchableOpacity`
  width: 100%;
  height: 60px;
  //border : 1px solid ${({ theme }) => theme.mainColor3};
  border-radius : 10px;
  margin-top : 20px;
  margin-bottom: 10px;
  justify-content: center;
  align-items: center; 
  flex-direction : row;
  
  
`;

const _menuButton = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  //border : 1px solid blue;
  margin-right : 5px;
  margin-left : 5px;
  border-radius : 10px;
  align-items: center;
  justify-content: center;
  background-color : ${({ theme }) => theme.white};
`;

const __communityButton = styled.View`
  margin: 0 auto;
  width: 95%;
  padding : 5px;
  height: 280px;
  background-color : ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.gray5};
  border-radius : 7px;
  margin-top: 10px;
  margin-bottom: 10px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;


const CommunityText = styled.View`
flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  top : 0px;
  margin-bottom : 10px;
`;

const CommunityText1 = styled.Text`
color : ${({ theme }) => theme.black};
  font-size : 18px;
  font-weight : bold;
  `;

const CommunityList = styled.TouchableOpacity`
  width: 90%;
  height: 40px;
  //background-color: ${({ theme }) => theme.mainColor3}; /* 배경 색상을 원하는 대로 변경하세요 */
  justify-content: center;
  border-radius : 10px;
  align-items: flex-start;
  padding : 10px;
  
 
`;

const HorizontalLine = styled.View`
width : 90%;
border-bottom-width: 0.85px;
border-bottom-color: ${({ theme }) => theme.gray2};
margin-vertical: 3px; 
`;

//background-color: ${({ theme }) => theme.mainColor3}; /* 배경 색상을 원하는 대로 변경하세요 */
export default HomeMain;
