import React from 'react';
import { Alert } from 'react-native';
import WebView from 'react-native-webview';
import { useContext } from 'react';
import { UserContext } from '../contexts';

const CLIENT_ID = 'M0Z_vtlzGvZMv9VU2eFj';
const REDIRECT_URL = 'https://exp.host/@taeyou/react-exam/index.exp?sdkVersion=48.0.0';

const NaverLogin = () => {
const { dispatch } = useContext(UserContext);
  
  const fetchNaverUserInfo = async (token) => {
    const API_URL = 'https://openapi.naver.com/v1/nid/me';

    try {
      let response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let responseJson = await response.json();
      
      if (responseJson.resultcode === '00') {
        return responseJson.response;
      } else {
        console.error('네이버 사용자 정보 요청 실패:', responseJson.message);
        return null;
      }
    } catch (error) {
      console.error('네이버 사용자 정보 요청 중 오류 발생:', error);
      return null;
    }
  };

  const handleWebViewNavigationStateChange = async (webViewState) => {
    const { url } = webViewState;

    if (url.includes('access_token=')) {
      const token = url.split('access_token=')[1].split('&')[0];
      const userInfo = await fetchNaverUserInfo(token);
      
      if (userInfo) {
        dispatch({name : userInfo.name, email : userInfo.id, uid : token});
        //Alert.alert('네이버 로그인 성공', `사용자 이름: ${userInfo.name}`);
        console.log(userInfo);
      }
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
