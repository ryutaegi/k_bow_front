import React, { useState, useEffect, useContext } from 'react';
import { ProgressContext, UserContext } from '../contexts';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { images } from '../utils/images';
import { Dimensions, Animated } from 'react-native';
import getEnvVars from '../../environmant';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

import styled, {ThemeContext} from 'styled-components/native';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { spinner } = useContext(ProgressContext);
  const { dispatch } = useContext(UserContext);
  const theme = useContext(ThemeContext);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const initialWidth = new Animated.Value(windowWidth);
  const initialHeight = new Animated.Value(windowHeight+100);
  const logomargin = Animated.subtract(initialHeight, new Animated.Value(320));
  const { apiUrl } = getEnvVars;

  useEffect(() => {
    // 1초 후에 애니메이션 시작
    setTimeout(() => {
     

      Animated.timing(initialHeight, {
        toValue: windowHeight*0.6, // 최종 높이
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }, 1000);
  }, []);
 
 
  

  return (
    <Container>
      
      <Animated.View style={{
        backgroundColor: theme.wiget22,
        width: '100%',
        height: initialHeight,
        position: 'absolute',
        top: 0,
        left: 0,
        borderBottomLeftRadius : 70,
        borderBottomRightRadius : 70,
        zIndex : 10,
      }} >
<Animated.View style={{alignItems : 'center', marginTop : logomargin}}>
      <Logo source={require('../../images/logo3.png')} resizeMode="contain" />
      <Title>활 로</Title>
     </Animated.View>
      </Animated.View>
      
      {/* <View style={{backgroundColor : theme.wiget22, width : '100%', borderBottomEndRadius : 100, borderBottomLeftRadius : 100}}>
      
     </View> */}

     <View style={{marginBottom : 10}}>
      <View style={{marginTop : 0, flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center'}}>
      <View style={{width : '30%', height : 1.5, backgroundColor : 'rgb(210,210,210)'}}></View>
      <Text style={{fontSize : 13, color : 'rgb(190,190,190)', lineHeight : 13}}>  로그인 / 회원가입  </Text>
      <View style={{width : '30%', height : 1.5, backgroundColor : 'rgb(210,210,210)'}}></View>
      </View>
      
      <SocialLoginButton style={{backgroundColor : 'rgb(254, 229, 0)'}} onPress={() => navigation.navigate('KakaoLogin')}>
      <Image resizeMode="contain" style={{height : 30}} source={require('../../images/login/kakao_logo.png')} />
      <Text style={{color : 'black', fontSize : 16}}> 카카오로 시작하기</Text>
      </SocialLoginButton>

      <SocialLoginButton style={{backgroundColor : '#03C75A'}} onPress={() => navigation.navigate('NaverLogin')}>
      <Image resizeMode="contain" style={{height : 30}} source={require('../../images/login/naver_logo.png')} />
      <Text style={{color : 'white', fontSize : 16}}> 네이버로 시작하기</Text>
      </SocialLoginButton>

      
    
      </View>
     
      
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  justify-content: flex-end;
  align-items: center;

  padding-top : 0px;
  background-color : white;
`;

const Logo = styled.Image`
  width: 200px;
  height: 200px;
  border-radius : 0px;
`;

const Title = styled.Text`
  font-size: 35px;
  font-weight : bold;
  color : white;
  margin-top: 30px;
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

const SocialLoginButton = styled.TouchableOpacity`
height: 50px;
flex-direction : row;
justify-content: center;
border-radius : 15px;
align-items: center;
margin-top : 10px;

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
