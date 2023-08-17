import React, { useState, useContext } from 'react';
import { ProgressContext, UserContext } from '../contexts';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { images } from '../utils/images';
import { login, signInGoogle } from '../utils/firebase';
import styled from 'styled-components/native';


const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { spinner } = useContext(ProgressContext);
  const { dispatch } = useContext(UserContext);

 

  const handleLogin = async () => {
    try {
      spinner.start();
      const user = await login({ email, password });
      dispatch(user);
      //alert("로그인");
    } catch (e) {
      Alert.alert('로그인 오류', e.message);
    } finally {
      spinner.stop();
    }
  };
  const googleLogin = async () => {
    // try {
    //   spinner.start();
      const user = await signInGoogle();
      //dispatch(user);
      //alert("로그인");
    // } catch (e) {
    //   Alert.alert('로그인 오류', e.message);
    // } finally {
    //   spinner.stop();
    // }
  };

  return (
    <Container>
      <Logo source={{ uri: images.logo }} />
      <Title></Title>
      <Input
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
      />
      <Input
        placeholder="비밀번호"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <LoginButton onPress={handleLogin}>
        <LoginButtonText>로그인</LoginButtonText>
      </LoginButton>

      <View style={{flexDirection : 'row', justifyContent : 'space-between', width : "45%"}}>
      <SignupButton onPress={() => navigation.navigate('Signup')}>
        <OtherButtonText>회원 가입</OtherButtonText>
      </SignupButton>
        <Text>|</Text>
      <SignupButton onPress={() => navigation.navigate('Signup')}>
        <OtherButtonText>계정 찾기</OtherButtonText>
      </SignupButton>
      </View>
     
      
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
  padding-top : 0px;
  background-color : white;
`;

const Logo = styled.Image`
  width: 50%;
  height: 23%;
  
`;

const Title = styled.Text`
  font-size: 30px;
  margin-bottom: 40px;
`;

const Input = styled.TextInput`
  width: 100%;
  height: 40px;
  border-color: gray;
  border-width: 1px;
  margin-bottom: 10px;
  padding-horizontal: 10px;
  background-color: rgb(220,220,255);
  border-color : rgb(150,150,255);
  border-radius : 5px;
`;

const LoginButton = styled.TouchableOpacity`
  width: 100%;
  height: 40px;
  background-color: rgb(100,100,255); /* 배경 색상을 원하는 대로 변경하세요 */
  justify-content: center;
  border-radius : 10px;
  align-items: center;
  margin-top : 20px;
  margin-bottom: 10px;
`;

const SignupButton = styled.TouchableOpacity``;

const LoginButtonText = styled.Text`
  color: white; /* 텍스트 색상을 원하는 대로 변경하세요 */
  font-size: 16px;
`;

const OtherButtonText = styled.Text`
  color: black; /* 텍스트 색상을 원하는 대로 변경하세요 */
  font-size: 14px;
`;

export default Login;
