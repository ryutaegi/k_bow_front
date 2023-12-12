import React, { useEffect, useState, useContext } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { UserContext, ProgressContext } from './contexts';
import  {Image}  from './components';
import { Button, Alert } from 'react-native';
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

//   if(user.LoginType=="kakao")
//   {
//     try {
//       const response = await axios.post('https://kapi.kakao.com/v1/user/logout', {}, {
//           headers: {
//               Authorization: `Bearer ${user.uid}`
//           }
//       });
      
//       if (response.status === 200) {
//           console.log("Successfully logged out from Kakao");
//           dispatch({name : null, email : null, uid : null, jeong : null, start_year : null});
//           return true;
//       } else {
//           console.error("Failed to log out from Kakao");
//           return false;
//       }
//   } catch (error) {
//       console.error("Error logging out from Kakao:", error);
//       return false;
//   }
//   }else if(user.LoginType=="naver"){
//     dispatch({name : null, email : null, uid : null, jeong : null, start_year : null});
//           console.log("Successfully logged out from Naver");
//   }
//   else{
//   try{
//     spinner.start();
//     await logout();
//   }catch (e) {
//     console.log('[Profile] logout : ', e.message);
//   } finally {
//     dispatch({});
//     spinner.stop();
//   }
// }
 };

 const _handwithdrawButtonPress = () => {
  Alert.alert(
    "회원 탈퇴하기",
    "활로 회원을 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.",
    [
      {
        text: "아니오",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "예", onPress: () => console.log("ok Pressed") },
    ],
    { cancelable: false }
  );
 }



//  const logoutFromKakao = async () => {
//   try {
//       const response = await axios.post('https://kapi.kakao.com/v1/user/logout', {}, {
//           headers: {
//               Authorization: `Bearer ${user.uid}`
//           }
//       });
      
//       if (response.status === 200) {
//           console.log("Successfully logged out from Kakao");
//           dispatch({name : null, email : null, uid : null, jeong : null, start_year : null});
//           return true;
//       } else {
//           console.error("Failed to log out from Kakao");
//           return false;
//       }
//   } catch (error) {
//       console.error("Error logging out from Kakao:", error);
//       return false;
//   }
// };

// const logoutFromNaver = async () => {
//           dispatch({name : null, email : null, uid : null, jeong : null, start_year : null});
//           console.log("Successfully logged out from Naver");
// };



 

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
                  { text: "예", onPress: () => console.log("ok press") },
                ],
                { cancelable: false }
              )
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
