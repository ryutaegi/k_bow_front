import React, { useState, useEffect, useContext } from 'react';
import { ProgressContext, UserContext } from '../contexts';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { images } from '../utils/images';
import { Dimensions, Animated } from 'react-native';
import getEnvVars from '../../environmant';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';

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
    GoogleSignin.configure({
      webClientId: getEnvVars.GOOGLE_WEB_CLIENT_ID,
      iosClientId: getEnvVars.GOOGLE_IOS_CLIENT_ID,
    });

    // 1초 후에 애니메이션 시작
    setTimeout(() => {
      Animated.timing(initialHeight, {
        toValue: windowHeight*0.6,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }, 1000);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.idToken;

      const loginResponse = await axios({
        method: 'post',
        url: apiUrl + '/api/google/login',
        data: { token: idToken },
      });

      const jwtToken = loginResponse.data.token;
      const decodedToken = jwtDecode(jwtToken);

      await AsyncStorage.setItem('userToken', jwtToken);
      await AsyncStorage.setItem('userInfo', JSON.stringify({
        name: decodedToken.nickname,
        imageURL: userInfo.user?.photo || null,
        social_id: decodedToken.social_id,
        user_id: decodedToken.user_id,
        social_type: decodedToken.social_type,
        agree: decodedToken.agree,
      }));

      dispatch({
        name: decodedToken.nickname,
        imageURL: userInfo.user?.photo || null,
        social_id: decodedToken.social_id,
        user_id: decodedToken.user_id,
        social_type: decodedToken.social_type,
        jwtToken,
        agree: decodedToken.agree,
      });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return;
      } else if (error.code === statusCodes.IN_PROGRESS) {
        return;
      } else {
        Alert.alert('로그인 실패', '구글 로그인 중 오류가 발생했습니다.');
      }
    }
  };

  const handleAppleLogin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const nickname = credential.fullName?.givenName
        ? `${credential.fullName.familyName || ''}${credential.fullName.givenName}`
        : undefined;

      const loginResponse = await axios({
        method: 'post',
        url: apiUrl + '/api/apple/login',
        data: { token: credential.identityToken, nickname },
      });

      const jwtToken = loginResponse.data.token;
      const decodedToken = jwtDecode(jwtToken);

      await AsyncStorage.setItem('userToken', jwtToken);
      await AsyncStorage.setItem('userInfo', JSON.stringify({
        name: decodedToken.nickname,
        imageURL: null,
        social_id: decodedToken.social_id,
        user_id: decodedToken.user_id,
        social_type: decodedToken.social_type,
        agree: decodedToken.agree,
      }));

      dispatch({
        name: decodedToken.nickname,
        imageURL: null,
        social_id: decodedToken.social_id,
        user_id: decodedToken.user_id,
        social_type: decodedToken.social_type,
        jwtToken,
        agree: decodedToken.agree,
      });
    } catch (error) {
      if (error.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('로그인 실패', '애플 로그인 중 오류가 발생했습니다.');
      }
    }
  };
 
 
  

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
      
      <SocialLoginButton style={{backgroundColor : '#fff', borderWidth: 1, borderColor: '#ddd'}} onPress={handleGoogleLogin}>
        <Image source={require('../../images/login/google_logo.png')} style={{width: 18, height: 18, marginRight: 8}} resizeMode="contain" />
        <Text style={{color : '#333', fontSize : 16}}>Google로 시작하기</Text>
      </SocialLoginButton>

      <SocialLoginButton style={{backgroundColor : '#000'}} onPress={handleAppleLogin}>
      <Image source={require('../../images/login/apple_logo.png')} style={{width: 24, height: 24, marginRight: 8}} resizeMode="contain" />
      <Text style={{color : '#fff', fontSize : 16}}>Apple로 시작하기</Text>
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
