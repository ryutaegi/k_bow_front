import React, { useState, useContext } from 'react';
import { ProgressContext, UserContext } from '../contexts';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { images } from '../utils/images';
import { login } from '../utils/firebase';
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

  return (
    <Container>
      <Logo source={{ uri: images.logo }} />
      <Title>login</Title>
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
        <ButtonText>로그인</ButtonText>
      </LoginButton>

      <SignupButton onPress={() => navigation.navigate('Signup')}>
        <ButtonText>회원가입</ButtonText>
      </SignupButton>

      <LoginButton onPress={handleLogin}>
        <ButtonText>구글 로그인</ButtonText>
      </LoginButton>
      
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Logo = styled.Image`
  width: 200px;
  height: 200px;
`;

const Title = styled.Text`
  font-size: 30px;
  margin-bottom: 20px;
`;

const Input = styled.TextInput`
  width: 100%;
  height: 40px;
  border-color: gray;
  border-width: 1px;
  margin-bottom: 10px;
  padding-horizontal: 10px;
`;

const LoginButton = styled.TouchableOpacity`
  width: 100%;
  height: 40px;
  background-color: blue; /* 배경 색상을 원하는 대로 변경하세요 */
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

const SignupButton = styled.TouchableOpacity``;

const ButtonText = styled.Text`
  color: white; /* 텍스트 색상을 원하는 대로 변경하세요 */
  font-size: 18px;
`;

export default Login;
