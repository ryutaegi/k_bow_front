import React, { useContext } from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';
import { UserContext } from '../contexts';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import getEnvVars from '../../environmant';
import { Alert, View, StyleSheet } from 'react-native';

const AppleLogin = ({ navigation }) => {
  const { dispatch } = useContext(UserContext);
  const { apiUrl } = getEnvVars;

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
    <View style={styles.container}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={15}
        style={styles.button}
        onPress={handleAppleLogin}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  button: {
    width: 280,
    height: 50,
  },
});

export default AppleLogin;
