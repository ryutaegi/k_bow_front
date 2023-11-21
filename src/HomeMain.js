import React, { useContext, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TextInput, Button, FlatList, Touchable, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { Card, Text, ListItem } from 'react-native-elements';
import styled, {ThemeContext} from 'styled-components/native';
import { Fontisto } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { UserContext } from './contexts';
import getEnvVars from '../environmant';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const HomeMain = ( {navigation} ) => {
  const theme = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const [inputData, SetInput] = useState([]);
  const { apiUrl } = getEnvVars();

  const rerend = () => {
    console.log("user",user.user_id)
    if((user.user_id !== null) && (user.user_id !== undefined))
    {
    axios({
      method: "get",
      url: `${apiUrl}/api/group/join/list`,
      headers: {
        Authorization: `${user.jwtToken}`,
      },
    })
      .then((response) => {
        console.log(response.data);
        const _inputData = response.data.map((rowData) => ({
          group_id: rowData.group_id,
          group_name: rowData.group_name,
          group_description: rowData.group_description,
          group_maker_id : rowData.group_maker_id,
          is_password: rowData.is_password,
        }));
        SetInput(_inputData);
        
        
      })
      .catch(function (e) {
        // console.log(e);
        if (e.response) {
          // 서버가 2xx 외의 상태 코드로 응답한 경우
          switch (e.response.status) {
            case 403:
              Alert.alert("안내", "권한이 없습니다.");
              break;
            case 500:
              Alert.alert("안내", "서버 에러가 발생했습니다.");
              break;
            case 409:
              Alert.alert("안내", "이미 가입한 그룹입니다.");
              break;
            default:
              Alert.alert("안내", "알 수 없는 에러가 발생했습니다.");
          }
        } else if (e.request) {
          // 요청은 만들어졌지만, 서버가 응답하지 않은 경우
          Alert.alert("안내", "서버로부터 응답이 없습니다.");
        } else {
          // 그 외에 어떤 것이든 요청을 설정하는 중에 오류가 발생한 경우
          Alert.alert("안내", "요청 생성 중에 오류가 발생했습니다.");
        }
      });
    }
    else{
      SetInput([]);
    }
  }
  useFocusEffect(
    React.useCallback(() => {
      console.log("focus");
      rerend();
    }, [user])
  );

  useEffect(()=> {
    rerend();
  }, [user])

    return (
      <ScrollView showsHorizontalScrollIndicator={false}>
      <View style={{height : theme.viewHeight*0.23}}>
      <ScrollView style={Style.scrollstyle} horizontal={true} showsHorizontalScrollIndicator={false}>
      
      <TopBoardButton>
      <Feather name="book-open" size={35} color={theme.blue5} />
        <Text style={Style.title}>
          국궁이 처음이라면
          </Text>
          <Text style={[Style.text, {color : theme.blue5}]}>
          국궁 배우기
          </Text></TopBoardButton>
      <TopBoardButton>
      <Feather name="alert-triangle" size={35} color={theme.red} />
        <Text style={Style.title}>
          긴급 공지
          </Text>
          <Text style={[Style.text, {color : theme.red}]}>
          매우 졸려
          </Text></TopBoardButton>
      <TopBoardButton>
      <AntDesign name="Trophy" size={35} color={theme.blue3} />
        <Text style={Style.title}>
          가까운 대회
          </Text>
          <Text style={[Style.text, {color : theme.blue3}]}>
          가까운 대회
          </Text></TopBoardButton>
      </ScrollView>
      </View>
      {/* <__menuButton>
      <_menuButton style={{backgroundColor : theme.white}}></_menuButton>
      <_menuButton style={{backgroundColor : theme.white}}></_menuButton>
      <_menuButton style={{backgroundColor : theme.white}}></_menuButton>
      <_menuButton style={{backgroundColor : theme.white}}></_menuButton>
      </__menuButton> */}



      <__communityButton>
      
        
        
        <_CommunityList>
      <CommunityList
        style={{backgroundColor : theme.wiget1, padding : 10}}
        onPress={() => {
          if(user.user_id == null)
          {Alert.alert("안내", "로그인이 필요합니다");}
          else
          {navigation.navigate('board2', {board_type:1})}
        }}
        >
          <AntDesign name="notification" size={28} color={theme.wiget11} />
       </CommunityList>
       <Text style={{marginLeft : 13}}>공 지</Text>
       </_CommunityList>

       <_CommunityList>
      <CommunityList
        style={{backgroundColor : theme.wiget2, padding : 10}}
        onPress={() => {
          if(user.user_id == null)
          {Alert.alert("안내", "로그인이 필요합니다");}
          else
          {navigation.navigate('board2', {board_type:2})}
        }}
        >
          <FontAwesome name="pencil-square-o" size={28} color={theme.wiget22} />
       </CommunityList>
       <Text style={{marginLeft : 13}}>자 유</Text>
       </_CommunityList>

       <_CommunityList>
      <CommunityList
        style={{backgroundColor : theme.wiget3}}
        onPress={() => {
          if(user.user_id == null)
          {Alert.alert("안내", "로그인이 필요합니다");}
          else
          {navigation.navigate('board2', {board_type:4})}
        }}
        >
          <AntDesign name="bells" size={28} color={theme.wiget32} />
       </CommunityList>
       <Text style={{marginLeft : 13}}>홍 보</Text>
       </_CommunityList>

       <_CommunityList>
      <CommunityList
        style={{backgroundColor : theme.wiget4}}
        onPress={() => {
          if(user.user_id == null)
          {Alert.alert("안내", "로그인이 필요합니다");}
          else
          {navigation.navigate('board2', {board_type:3})}
        }
      }>
          <AntDesign name="info" size={28} color={theme.wiget42} />
       </CommunityList>
       <Text style={{marginLeft : 13}}>정 보</Text>
       </_CommunityList>
       
      

      </__communityButton>
      
      <__communityButton1>
      <CommunityText>
        <CommunityText1>  그룹</CommunityText1>
        <TouchableOpacity onPress={() => 
        {
          if(user.user_id == null)
          {Alert.alert("안내", "로그인이 필요합니다");}
          else
          {navigation.navigate('GroupAdd')}
        }
          }>
        <Text style={{color:'gray'}}>추가하기 <Ionicons name="add" size={16} color="gray" /></Text>
        </TouchableOpacity>
        </CommunityText>
      <HorizontalLine style={{marginBottom : 15}}/>
      
      {inputData.length > 0 ?
      (
        inputData.map((group, index) => (
          <Container
            key={index}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              overflow : 'hidden',
              backgroundColor : theme.white
            }}
            onPress={() => {navigation.navigate('GroupDetail', {group_id : group.group_id, group_maker_id : group.group_maker_id})}}
          >
            <View style={{flexDirection : 'row', alignItems : 'center'}}>
            {group.is_password==1 ? (
              <MaterialIcons style={{marginLeft : 15}} name="group" size={24} color={theme.wiget32} />
            ) : (
              <MaterialIcons style={{marginLeft : 15}} name="group" size={24} color={theme.wiget22} />
            )}

            <View style={{marginLeft : 15}}>
              <Title>{group.group_name}</Title>
              {/* <Content>{group.group_description}</Content> */}
            </View>
            </View>
            <Text style={{marginRight : 15, color : 'rgb(170,170,170)'}}>
              {'>'}
            </Text>
            
          </Container>
        ))
      ) : (
      <GroupAdd onPress={() => {
        {
          if(user.user_id == null)
          {Alert.alert("안내", "로그인이 필요합니다");}
          else
          { navigation.navigate('GroupAdd') }
        }
       }}>
      <AntDesign name="pluscircle" size={40} color={theme.wiget32} />
      <Text style={{padding : 10}}>그룹을 추가해 구/신사와 교류하세요
      </Text>
      </GroupAdd>
      )
      }
      
      
      
       
       
       
       
      </__communityButton1>
       
      </ScrollView>
    );
};



const Style = StyleSheet.create({
  scrollstyle : {
    marginTop : 20,
    //borderWidth : 1,
    width : '100%',
  },
  title : {
    marginTop : 5,
    fontSize : 15,
    fontWeight : 'bold',
    color : '#000',
  },
  text : {
    fontSize : 15,
    color : '#000',
  }
})

const Container = styled.TouchableOpacity`
  align-content: center;
  border-radius: 10px;
  width: 100%;
  background-color: ${({ theme }) => theme.white};
  //border : 1px solid red;
  height: 50px;
  margin-bottom: 10px;
  flex-direction: column;
  padding: 0px;
  elevation: 5;
`;
const Title = styled.Text`
 
  
  font-size: 15px;
  
`;
const Content = styled.Text`
 
  height: 35%;
`;

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
  elevation : 4;
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
  height: 100px;
  background-color : ${({ theme }) => theme.white};
  //border: 1px solid ${({ theme }) => theme.gray5};
  border-radius : 7px;
  margin-top: 10px;
  margin-bottom: 10px;
  justify-content: flex-start;
  flex-direction: row;
    align-items: center;
    padding : 40px;
`;

const __communityButton1 = styled.View`
  margin: 0 auto;
  width: 95%;
  padding : 10px;
  background-color : ${({ theme }) => theme.white};
  //border: 1px solid ${({ theme }) => theme.gray5};
  border-radius : 7px;
  margin-top: 10px;
  margin-bottom: 10px;
  
`;


const CommunityText = styled.View`
flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  top : 0px;
  margin-bottom : 3px;
  
`;

const CommunityText1 = styled.Text`
color : ${({ theme }) => theme.black};
  font-size : 18px;
  font-weight : bold;
  `;

  const _CommunityList = styled.TouchableOpacity`
  width: 85px;
  height: 80px;
  
 
  
 
`;

const CommunityList = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  background-color: ${({ theme }) => theme.wiget1}; /* 배경 색상을 원하는 대로 변경하세요 */
  justify-content: center;
  border-radius : 10px;
 
  padding : 16px;
  elevation : 1;
 
`;

const CommunityList1 = styled.TouchableOpacity`
  width: 100%;
  height: 60px;
  background-color: ${({ theme }) => theme.wiget1}; /* 배경 색상을 원하는 대로 변경하세요 */
  justify-content: center;
  border-radius : 10px;
  margin-top : 5px;
 
  padding : 10px;
  
 
`;

const HorizontalLine = styled.View`
width : 100%;
border-bottom-width: 0.85px;
border-bottom-color: ${({ theme }) => theme.gray2};
margin-vertical: 3px; 
`;

const GroupAdd = styled.TouchableOpacity`
width: 100%;
  height: 100px;
  background-color: ${({ theme }) => theme.wiget3}; /* 배경 색상을 원하는 대로 변경하세요 */
  justify-content: center;
  flex : 1;
  border-radius : 10px;
  margin-top : 5px;
  flex-direction : row;
 align-item : center;
  padding-top : 30px;
  elevation : 3;

`

//background-color: ${({ theme }) => theme.mainColor3}; /* 배경 색상을 원하는 대로 변경하세요 */
export default HomeMain;
