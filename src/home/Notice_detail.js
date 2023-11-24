import React, { useState, useContext, useEffect } from 'react';
import {Modal, View, Text, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
import { UserContext } from '../contexts';
import axios from 'axios';
import UpdatePost from './UpdatePost';
import { SpeedDial } from '@rneui/themed';
import getEnvVars from '../../environmant';

const Notice_detail = ({ route, navigation, modalVisible, setModalVisible }) => {
  const { apiUrl } = getEnvVars();
  const theme = useContext(ThemeContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [user_name, setUser_name] = useState('');
  const [board_time, setBoard_time] = useState('');
  const [maker_id, setMaker_id] = useState(0);
  const { user }  = useContext(UserContext);
  const board_type = route.params.board_type;
  const board_id = route.params.board_id;
  const [open, setOpen] = useState(false);
    

 

  const delete_post = async () => {
    try {
        const response = await axios.post(`${apiUrl}/api/board/delete/${board_id}`, 
        {},
        {
            headers: {
                'Authorization': `${user.jwtToken}`
            }
        });
        navigation.navigate('board2', {board_type: board_type}); // 성공하면 이전 화면으로 돌아갑니다.
         
      } catch(e) {
        console.log(e);

        if (e.response) {
            // 서버가 2xx 외의 상태 코드로 응답한 경우
            switch(e.response.status) {
                case 403:
                    alert('권한이 없습니다.');
                    break;
                case 500:
                    alert('서버 에러가 발생했습니다.');
                    break;
                default:
                    alert('알 수 없는 에러가 발생했습니다.');
            }
        } else if (e.request) {
            // 요청은 만들어졌지만, 서버가 응답하지 않은 경우
            alert('서버로부터 응답이 없습니다.');
        } else {
            // 그 외에 어떤 것이든 요청을 설정하는 중에 오류가 발생한 경우
            alert('요청 생성 중에 오류가 발생했습니다.');
        }
    }
}


    useEffect(() => {
        const fetchPosts = async () => {
        try{
            const response = await axios.get(apiUrl+'/api/board/detail/'+board_id, {
                headers: {
                    'Authorization': `${user.jwtToken}`
                }
            });
            setUser_name(response.data[0].nickname);
            setBoard_time(response.data[0].created_at);
            setTitle(response.data[0].title);
            setContent(response.data[0].content);
            setMaker_id(response.data[0].user_id);
            
        }catch(e)
        {console.log(e);}
    };
    fetchPosts();
    }, [])

   

  return (
    <>
    <View style={{ padding: 20, }}>


       

      <UserView>{user_name}</UserView>
      <UserTime>{board_time.slice(0, 10)} {board_time.slice(11, 16)}</UserTime>
      <TitleText>{title}</TitleText>
      <ContentText>{content}</ContentText>
      <HorizontalLine/>


      
      
      
    </View>
    <SpeedDial
    color={theme.wiget22}
    isOpen={open}
    icon={{ name: 'edit', color: '#fff' }}
    openIcon={{ name: 'close', color: '#fff' }}
    onOpen={() => setOpen(!open)}
    onClose={() => setOpen(!open)}
  >
    <SpeedDial.Action
      color={theme.wiget22}
        icon={{ name: 'delete', color: '#fff' }}
        title="신고"
        onPress={() => {setOpen(!open); Alert.alert("신고","신고하기")}}
      />
    {user.user_id == maker_id ? 
    (<><SpeedDial.Action
      color={theme.wiget22}
        icon={{ name: 'add', color: '#fff' }}
        title="수정"
        onPress={() => {
          setOpen(!open);
          navigation.navigate("update_post", {board_type : board_type, board_id : board_id, title : title, content : content} )
        }}
      />
      <SpeedDial.Action
      color={theme.wiget22}
        icon={{ name: 'delete', color: '#fff' }}
        title="삭제"
        onPress={() => {setOpen(!open); delete_post()}}
      /></>):null}
      
    
  </SpeedDial>
  </>
  );
};

const Label = styled.Text`
  font-size: 16px;
  margin-bottom: 5px;
`;

const UserView = styled.Text`

font-size : 18px;
font-weight : bold;
`;

const UserTime = styled.Text`

font-size : 14px;
color : #999;

`;

const TitleText = styled.Text`
 
  margin-top : 10px;
  padding: 10px;
  font-size : 16px;
  font-weight : bold;
`;

const ContentText = styled.Text`
 
  padding: 10px;
  margin-bottom: 20px;
`;

const HorizontalLine = styled.View`
border-bottom-width: 0.85px;
border-bottom-color: gray;
width : 100%;

`;
const SubmitButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.mainColor4};
  padding: 10px;
  align-items: center;
  border-radius: 5px;
`;

export default Notice_detail;
