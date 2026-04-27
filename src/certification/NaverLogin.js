import React, { useRef, useContext } from 'react';
import WebView from 'react-native-webview';
import { UserContext } from '../contexts';
import getEnvVars from '../../environmant';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REDIRECT_URL = 'https://spinnerweb.netlify.app';

const NaverLogin = () => {
  const { dispatch } = useContext(UserContext);
  const { apiUrl, NAVER_CLIENT_ID } = getEnvVars;
  const tokenProcessed = useRef(false); // var 대신 ref 사용 (리렌더링에도 유지됨)

  const handleWebViewNavigationStateChange = async (webViewState) => {
    if (tokenProcessed.current) return;
    const { url } = webViewState;

    if (url.includes('access_token=')) {
      tokenProcessed.current = true;
      const token = url.split('access_token=')[1].split('&')[0];

      try {
        const loginResponse = await axios({
          method: 'post',
          url: apiUrl + '/api/naver/login',
          data: { token },
        });

        const AccessToken = loginResponse.data.token;
        const decodedToken = jwtDecode(AccessToken);

        await AsyncStorage.setItem('userToken', AccessToken);
        await AsyncStorage.setItem('userInfo', JSON.stringify({
          name: decodedToken.nickname,
          imageURL: decodedToken.image_url,
          social_id: decodedToken.social_id,
          user_id: decodedToken.user_id,
          social_type: decodedToken.social_type,
          agree: decodedToken.agree,
        }));

        dispatch({
          name: decodedToken.nickname,
          imageURL: decodedToken.image_url,
          social_id: decodedToken.social_id,
          user_id: decodedToken.user_id,
          social_type: decodedToken.social_type,
          jwtToken: AccessToken,
          agree: decodedToken.agree,
        });
      } catch (error) {
        tokenProcessed.current = false; // 실패 시 재시도 가능하도록 초기화
        console.error('네이버 로그인 실패:', error);
      }
    }
  };

  return (
    <WebView
      source={{ uri: `https://nid.naver.com/oauth2.0/authorize?response_type=token&client_id=${NAVER_CLIENT_ID}&redirect_uri=${REDIRECT_URL}&state=YOUR_RANDOM_STATE` }}
      onNavigationStateChange={handleWebViewNavigationStateChange}
      style={{ flex: 1 }}
    />
  );
};

export default NaverLogin;
