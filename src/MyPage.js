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


const Container = styled.View`
flex : 1;
background-color: ${({ theme }) => theme.background};
justify-content: center;
align-items: center;
padding: 0 20px;
`;

const MyPage = () => {
  const { apiUrl } = getEnvVars();
 const { dispatch } = useContext(UserContext);
 const { spinner } = useContext(ProgressContext);
 const theme = useContext(ThemeContext);

 const {user} = useContext(UserContext);
 const [photoUrl, setPhotoUrl] = useState(user.imageURL);

 const _handleLogoutButtonPress = async () => {
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
    <Container>
      <Image
      url={photoUrl}
      showbutton
      rounded
      />

      <Input label="닉네임" value={user.name}/>
      
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
   
  );
};
const LoginButton = styled.TouchableOpacity`
  width: 100%;
  height: 40px;
  background-color: rgb(2,126,229); /* 배경 색상을 원하는 대로 변경하세요 */
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
