
import { View, StyleSheet } from "react-native";
import React, { useState, useContext } from 'react';
import { ProgressContext, UserContext } from '../contexts';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import getEnvVars from "../../environmant";


const REST_API_KEY = '9fd6d6c300b1e8d443843c3301a50ac5';
const REDIRECT_URI = 'https://exp.host/@taeyou/react-exam/index.exp?sdkVersion=48.0.0';
const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;


const KaKaoLogin = ({navigation}) => {
  const { dispatch } = useContext(UserContext);
  const { apiUrl } = getEnvVars();
  const { spinner } = useContext(ProgressContext);


  function KakaoLoginWebView (data) {
    const exp = "code=";
    var condition = data.indexOf(exp);    
    if (condition != -1) {
      var authorize_code = data.substring(condition + exp.length);
      //console.log(authorize_code);
      requestToken(authorize_code);
    };
  }

  const requestToken = async (authorize_code) => {
    var AccessToken = "none";
    
    axios ({
      method: 'post',
      url: 'https://kauth.kakao.com/oauth/token',
      params: {
        grant_type: 'authorization_code',
        client_id: REST_API_KEY,
        redirect_uri: REDIRECT_URI,
        code: authorize_code,

      },
    }).then((response) => {
      AccessToken = response.data.access_token;
      console.log(AccessToken);
      //console.log(response);
      
      

      

      return axios({
        method : 'post',
        url: apiUrl+'/api/kakao/login',
        data: {
          token : AccessToken,
        },
      }).then((response1) => {
        console.log('response1',response1.data);
        const decodedToken = jwtDecode(response1.data.token);
       console.log('Decoded Token', decodedToken);
        dispatch({name : decodedToken.nickname, 
          imageURL : decodedToken.image_url, 
          social_id : decodedToken.social_id,
          user_id : decodedToken.user_id,
          social_type : decodedToken.social_type,
          jwtToken : response1.data.token});


      }).catch(function (error) {
        console.log('error', error);
      })
      
    }).catch(function (error) {
      console.log('error', error);
    })

   
   
  };

  // function requestUserInfo(AccessToken)  { 이건 백에서 처리할거
  //   axios ({
  //     method: 'GET',
  //     url: 'https://kapi.kakao.com/v2/user/me',
  //     headers: {
  //       Authorization : `Bearer ${AccessToken}`
  //     },
  //   }).then((response) => {
  //     var user_email = response.data.kakao_account.email;
  //     var user_range = response.data.kakao_account.age_range;
  //     var user_gender = response.data.kakao_account.gender;
  //     console.log("user_emil", user_email);
  //     console.log("user_range", user_range);
  //     console.log("user_gender", user_gender);
  //     dispatch({LoginType : "kakao", email : user_email, uid : AccessToken});
  //   }).catch(function (error) {
  //     console.log('error', error);
  //   })
  //   return;
  // }

  // const storeData = async (returnValue) => { 백에서 발급한 accesstoken 사용할거임
  //   try {
  //     await AsyncStorage.setItem('userAccessToken', returnValue);
  //   } catch (error) {
  //   }
  // }

  return (
    <View style={Styles.container}>      
      <WebView
        style={{ flex: 1 }}
        originWhitelist={['*']}
        scalesPageToFit={false}
        source={{
          uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`,
        }}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        javaScriptEnabled
        onMessage={event => { KakaoLoginWebView(event.nativeEvent["url"]); }}
      />
    </View>
  )
}

export default KaKaoLogin;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    backgroundColor: '#fff',
  },    
});