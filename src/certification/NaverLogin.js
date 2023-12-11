import React, {useState} from 'react';
import { Alert } from 'react-native';
import WebView from 'react-native-webview';
import { useContext } from 'react';
import { UserContext } from '../contexts';
import getEnvVars from '../../environmant';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLIENT_ID = 'M0Z_vtlzGvZMv9VU2eFj';
const REDIRECT_URL = 'https://spinnerweb.netlify.app';

const NaverLogin = () => {
const { dispatch } = useContext(UserContext);
const {apiUrl} = getEnvVars;
var tokenProcessed = 0;


  const handleWebViewNavigationStateChange = async (webViewState) => {
    if (tokenProcessed == 1) return;
    const { url } = webViewState;
    var AccessToken = "";
    
    

    if (url.includes('access_token=')) {
      const token = url.split('access_token=')[1].split('&')[0];
      console.log("접근 토큰", url);
      tokenProcessed = 1;


      const loginResponse = await axios ({
        method: 'post',
        url: apiUrl+'/api/naver/login',
        data: {
          token: token,
  
        },
      })

        AccessToken = loginResponse.data.token;
        console.log(AccessToken);

        const decodedToken = jwtDecode(AccessToken);
       console.log('Decoded Token', decodedToken);

       await AsyncStorage.setItem('userToken', loginResponse.data.token);
       await AsyncStorage.setItem('userInfo', JSON.stringify({
         name: decodedToken.nickname,
         imageURL: decodedToken.image_url,
         social_id: decodedToken.social_id,
         user_id: decodedToken.user_id,
         social_type: decodedToken.social_type,
         agree: decodedToken.agree,
       }));
        dispatch({name : decodedToken.nickname, 
          imageURL : decodedToken.image_url, 
          social_id : decodedToken.social_id,
          user_id : decodedToken.user_id,
          social_type : decodedToken.social_type,
          jwtToken : AccessToken,
          agree : decodedToken.agree});
      
      


      //const userInfo = await fetchNaverUserInfo(token);
      
      // if (userInfo) {
      //   dispatch({LoginType : "naver", name : userInfo.name, email : userInfo.id, uid : token});
      //   //Alert.alert('네이버 로그인 성공', `사용자 이름: ${userInfo.name}`);
      //   console.log(userInfo);
      // }
    }
  };

  return (
    <WebView
      source={{ uri: `https://nid.naver.com/oauth2.0/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&state=YOUR_RANDOM_STATE` }}
      onNavigationStateChange={handleWebViewNavigationStateChange}
      style={{ flex: 1 }}
    />
  );
};

export default NaverLogin;
