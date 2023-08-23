import React, { useEffect, useState, useContext } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { getCurrentUser, logout, updateUserPhoto } from './utils/firebase';
import { UserContext, ProgressContext } from './contexts';
import  {Image}  from './components';
import { Button, Alert } from 'react-native';
import { Input } from 'react-native-elements';
import styled, {ThemeContext} from 'styled-components/native';

const Container = styled.View`
flex : 1;
background-color: ${({ theme }) => theme.background};
justify-content: center;
align-items: center;
padding: 0 20px;
`;

const MyPage = () => {
 const { dispatch } = useContext(UserContext);
 const { spinner } = useContext(ProgressContext);
 const theme = useContext(ThemeContext);

 const user = getCurrentUser();
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
    </Container>
   
  );
};

export default MyPage;
