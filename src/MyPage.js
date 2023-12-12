import React, { useEffect, useState, useContext } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { UserContext, ProgressContext } from './contexts';
import  {Image}  from './components';
import { Button, Alert, Linking } from 'react-native';
import { Input } from 'react-native-elements';
import styled, {ThemeContext} from 'styled-components/native';
import axios from 'axios';
import getEnvVars from '../environmant';
import JoinPresenter from './mypage/JoinPresenter';
import { SpeedDial } from "@rneui/themed";



const Container = styled.View`
flex : 1;
background-color: ${({ theme }) => theme.background};
justify-content: center;
align-items: center;
padding: 0 20px;
`;

const MyPage = () => {
  const { apiUrl } = getEnvVars;
 const { dispatch } = useContext(UserContext);
 const { spinner } = useContext(ProgressContext);
 const theme = useContext(ThemeContext);

 const {user} = useContext(UserContext);
 const [photoUrl, setPhotoUrl] = useState(user.imageURL);
 const [open, setOpen] = useState(false);

 const _handleLogoutButtonPress = async () => {
  if(user.social_type == 1)
  {
  console.log(user.social_id);
  axios({
    method : 'post',
    url: apiUrl+'/api/kakao/logout',
    data: {
      social_id : user.social_id,
    },
  }).then((response1) => {
    dispatch({name : null, 
      imageURL : null, 
      social_id : null,
      user_id : null,
      agree : null,
      social_type : null,
      jwtToken : null});
    console.log('로그아웃 완료',response1.data);
  }).catch(function (error) {
    console.log('error', error);
  })
}

if(user.social_type == 2)
{
  dispatch({name : null, 
    imageURL : null, 
    social_id : null,
    user_id : null,
    agree : null,
    social_type : null,
    jwtToken : null});
  console.log('로그아웃 완료');
}


 };

 const _handwithdrawButtonPress = () => {
  console.log("회원탈퇴 클릭함");

  axios({
    method : 'post',
    url: apiUrl+'/api/withdraw',
    data: {
      social_id : user.social_id,
    },
  }).then((response1) => {
    dispatch({name : null, 
      imageURL : null, 
      social_id : null,
      user_id : null,
      agree : null,
      social_type : null,
      jwtToken : null});
    console.log('회원 탈퇴 완료',response1.data);
  }).catch(function (error) {
    console.log('error', error);
  })

 }


 const openURL = (url) => {
  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    })
    .catch((err) => console.error('An error occurred', err));
};
 

  return (
    <>
    <Container>
      <Image
      url={photoUrl}
      showbutton
      rounded
      />

      <Input label="닉네임" value={user.name} disabled/>

      <Input label="로그인 유형" value={user.social_type==1 ? "카카오톡" : "네이버"} disabled/>
      
    <LoginButton onPress={_handleLogoutButtonPress}>
    <LoginButtonText>로그아웃</LoginButtonText>
    </LoginButton>




    

    {/* <Button
      title="logout_kakao"
      onPress={logoutFromKakao}
      containerStyle={{marginTop : 30, backgroundCOlor : theme.buttonLogout}}
    />

<Button
      title="logout_naver"
      onPress={logoutFromNaver}
      containerStyle={{marginTop : 30, backgroundCOlor : theme.buttonLogout}}
    /> */}
    </Container>

    <SpeedDial
        color={theme.wiget22}
        isOpen={open}
        icon={{ name: "menu", color: "#fff" }}
        openIcon={{ name: "close", color: "#fff" }}
        onOpen={() => setOpen(!open)}
        onClose={() => setOpen(!open)}
      >
   
          <SpeedDial.Action
            color={theme.wiget22}
            icon={{ name: "delete", color: "#fff" }}
            title="회원 탈퇴하기"
            onPress={() =>
              Alert.alert(
                "회원 탈퇴하기",
                "활로에서 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.",
                [
                  {
                    text: "아니오",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  { text: "예", onPress: () => _handwithdrawButtonPress() },
                ],
                { cancelable: false }
              )
            }
          />

<SpeedDial.Action
            color={theme.wiget22}
            icon={{ name: "folder", color: "#fff" }}
            title="개인정보 처리방침"
            onPress={() =>
              openURL('https://sites.google.com/view/bowapp/%ED%99%88')
            }
          />
     
      </SpeedDial> 
   </>
  );
};
const LoginButton = styled.TouchableOpacity`
  width: 100%;
  height: 40px;
  background-color: ${({ theme }) => theme.wiget22}; /* 배경 색상을 원하는 대로 변경하세요 */
  justify-content: center;
  border-radius : 10px;
  align-items: center;
  margin-top : 20px;
  margin-bottom: 10px;
`;

const LoginButtonText = styled.Text`
  color: white; /* 텍스트 색상을 원하는 대로 변경하세요 */
  font-size: 16px;
`;

export default MyPage;
