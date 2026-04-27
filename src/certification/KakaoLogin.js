import { View, StyleSheet } from "react-native";
import React, { useContext } from 'react';
import { ProgressContext, UserContext } from '../contexts';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import getEnvVars from "../../environmant";

const REDIRECT_URI = 'https://spinnerweb.netlify.app';
const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;

const KaKaoLogin = ({ navigation }) => {
  const { dispatch } = useContext(UserContext);
  const { apiUrl, KAKAO_REST_API_KEY } = getEnvVars;
  const { spinner } = useContext(ProgressContext);

  function KakaoLoginWebView(data) {
    const exp = "code=";
    const condition = data.indexOf(exp);
    if (condition !== -1) {
      const authorize_code = data.substring(condition + exp.length);
      requestToken(authorize_code);
    }
  }

  const requestToken = async (authorize_code) => {
    try {
      const tokenResponse = await axios({
        method: 'post',
        url: 'https://kauth.kakao.com/oauth/token',
        params: {
          grant_type: 'authorization_code',
          client_id: KAKAO_REST_API_KEY,
          redirect_uri: REDIRECT_URI,
          code: authorize_code,
        },
      });

      const AccessToken = tokenResponse.data.access_token;

      const loginResponse = await axios({
        method: 'post',
        url: apiUrl + '/api/kakao/login',
        data: { token: AccessToken },
      });

      const decodedToken = jwtDecode(loginResponse.data.token);

      await AsyncStorage.setItem('userToken', loginResponse.data.token);
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
        jwtToken: loginResponse.data.token,
        agree: decodedToken.agree,
      });
    } catch (error) {
      console.error('카카오 로그인 실패:', error);
    }
  };

  return (
    <View style={Styles.container}>
      <WebView
        style={{ flex: 1 }}
        originWhitelist={['*']}
        scalesPageToFit={false}
        source={{
          uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}`,
        }}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        javaScriptEnabled
        onMessage={event => { KakaoLoginWebView(event.nativeEvent["url"]); }}
      />
    </View>
  );
};

export default KaKaoLogin;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    backgroundColor: '#fff',
  },
});
