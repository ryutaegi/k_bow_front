import React, { useEffect, useState, useContext } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { getCurrentUser, logout, updateUserPhoto } from './utils/firebase';
import { UserContext, ProgressContext } from './contexts';
import  {Image}  from './components';
import { Button, Alert } from 'react-native';
import { Input } from 'react-native-elements';
import styled, {ThemeContext} from 'styled-components/native';
import axios from 'axios';

const Container = styled.View`
flex : 1;
background-color: ${({ theme }) => theme.background};
justify-content: center;
align-items: center;
padding: 0 20px;
`;
const CLIENT_ID = 'M0Z_vtlzGvZMv9VU2eFj';
const MyPage = () => {
 const { dispatch } = useContext(UserContext);
 const { spinner } = useContext(ProgressContext);
 const theme = useContext(ThemeContext);

 const {user} = useContext(UserContext);//getCurrentUser(); 이거 카카오 껄로 바꿔야함
 const [photoUrl, setPhotoUrl] = useState(user.photoUrl);

 const _handleLogoutButtonPress = async () => {
  try{
    spinner.start();
    await logout();
  }catch (e) {
    console.log('[Profile] logout : ', e.message);
  } finally {
    dispatch({});
    spinner.stop();
  }
 };

 const _handlePhotoChange = async url => {
  try {
    spinner.start();
    const updateUser = await updateUserPhoto(url);
    setPhotoUrl(updateUser.photoUrl);
  } catch (e) {
    Alert.alert('Photo Error', e.message);
  } finally{
    spinner.stop();
  }
 };

 const logoutFromKakao = async () => {
  try {
      const response = await axios.post('https://kapi.kakao.com/v1/user/logout', {}, {
          headers: {
              Authorization: `Bearer ${user.uid}`
          }
      });
      
      if (response.status === 200) {
          console.log("Successfully logged out from Kakao");
          dispatch({name : null, email : null, uid : null, jeong : null, start_year : null});
          return true;
      } else {
          console.error("Failed to log out from Kakao");
          return false;
      }
  } catch (error) {
      console.error("Error logging out from Kakao:", error);
      return false;
  }
};

const logoutFromNaver = async () => {
          dispatch({name : null, email : null, uid : null, jeong : null, start_year : null});
          console.log("Successfully logged out from Naver");
};



 

  return (
    <Container>
      <Image
      url={photoUrl}
      onChangeImage={_handlePhotoChange}
      showbutton
      rounded
      />

      <Input label="이름" value={user.name}/>
      <Input label="이메일" value={user.email}/>
      <Input label="소속 활터" value={user.jeong}/>
      <Input label="집궁 연도" value={user.start_year}/>
      <Button
      title="logout"
      onPress={_handleLogoutButtonPress}
      containerStyle={{marginTop : 30, backgroundCOlor : theme.buttonLogout}}
    />

    <Button
      title="logout_kakao"
      onPress={logoutFromKakao}
      containerStyle={{marginTop : 30, backgroundCOlor : theme.buttonLogout}}
    />

<Button
      title="logout_naver"
      onPress={logoutFromNaver}
      containerStyle={{marginTop : 30, backgroundCOlor : theme.buttonLogout}}
    />
    </Container>
   
  );
};

export default MyPage;
