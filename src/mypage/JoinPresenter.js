import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { UserContext } from "../contexts";
import { Linking } from 'react-native';
import axios from 'axios';
import getEnvVars from "../../environmant";
import styled, {ThemeContext} from 'styled-components/native';
import { Dimensions } from 'react-native';


const JoinPresenter = () => {
  const [allCheck, setAllCheck] = useState(false);
  const [termsCheck, setTermsCheck] = useState(false);
  const [privacyCheck, setPrivacyCheck] = useState(false);
  const [marketingCheck, setMarketingCheck] = useState(false);
  const { user } = useContext(UserContext);
  const { dispatch } = useContext(UserContext);
  const { apiUrl } = getEnvVars();
  const theme = useContext(ThemeContext);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const openURL = (url) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log("Don't know how to open URI: " + url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  const submitButtonStyle = {
    ...styles.submitButton,
    backgroundColor: allCheck ? theme.wiget22 : "rgb(190, 190, 190)",
  };

  const agreePress = () => {
    if (allCheck == true) {
      dispatch({
        ...user,
        agree: 1,
      });
      //user.agree = 1;

      axios({
        method: "post",
        url: `${apiUrl}/api/agree/update`,
        headers: {
          Authorization: `${user.jwtToken}`,
        },
        data: { agree: 1 },
      })
        .then((response) => {
          console.log(response);
        })
        .catch(function (e) {
          // console.log(e);
          if (e.response) {
            // 서버가 2xx 외의 상태 코드로 응답한 경우
            switch (e.response.status) {
              case 401:
                Alert.alert("안내", "비밀번호가 틀립니다.");
                break;
              case 403:
                Alert.alert("안내", "권한이 없습니다.");
                break;
              case 500:
                Alert.alert("안내", "서버 에러가 발생했습니다.");
                break;
              case 409:
                Alert.alert("안내", "이미 가입한 그룹입니다.");
                break;
              default:
                Alert.alert("안내", "알 수 없는 에러가 발생했습니다.");
            }
          } else if (e.request) {
            // 요청은 만들어졌지만, 서버가 응답하지 않은 경우
            alert("안내", "서버로부터 응답이 없습니다.");
          } else {
            // 그 외에 어떤 것이든 요청을 설정하는 중에 오류가 발생한 경우
            alert("안내", "요청 생성 중에 오류가 발생했습니다.");
          }
        });
    }
  };

  useEffect(() => {
    if (termsCheck && privacyCheck) {
      setAllCheck(true);
    } else {
      setAllCheck(false);
    }
  }, [termsCheck, privacyCheck, marketingCheck]);

  const handleAllCheck = () => {
    const newCheckState = !allCheck;
    setAllCheck(newCheckState);
    setTermsCheck(newCheckState);
    setPrivacyCheck(newCheckState);
    setMarketingCheck(newCheckState);
  };

  return (
    <View style={styles.container}>
  
      
      <View style={{alignItems : 'center', flexDirection : 'column',backgroundColor : theme.wiget22,
    borderBottomLeftRadius : 100,
    borderBottomRightRadius : 100}}>
    <Logo style={{marginTop : windowHeight*0.1}} source={require('../../images/logo3.png')} resizeMode="contain" />
    <Text style={{fontSize : 18, marginTop : 20, color : 'white'}}>회원가입</Text>
    <Text style={{fontSize : 15, margin : 15, color : 'rgb(210,210,210)'}}>회원가입 전, 활로 약관을 확인해 주세요</Text>
    </View>

      <View style={{marginBottom : 20, padding : 20}}>
      <View style={styles.switchContainer}>
        <View style={{flexDirection : 'row', alignItems : "center"}}>
        <Switch thumbColor={allCheck ? theme.wiget22 : '#f4f3f4'}
        trackColor={{ false: '#767577', true: theme.wiget2 }}
         value={allCheck} onValueChange={handleAllCheck} />
        <Text style={[styles.label, {fontSize : 15}]}>전체 동의</Text>
        </View>
        
      </View>
      <View style={{width : '100%', height : 1, backgroundColor : 'rgb(190,190,190)', marginBottom : 30}}>

</View>

      <View style={styles.switchContainer}>
      <View style={{flexDirection : 'row', alignItems : "center"}}>
        <Switch thumbColor={termsCheck ? theme.wiget22 : '#f4f3f4'}
        trackColor={{ false: '#767577', true: theme.wiget2 }}
        value={termsCheck} onValueChange={setTermsCheck} />
        <TouchableOpacity onPress={() => (setTermsCheck(!termsCheck))}>
        <Text style={styles.label}>이용약관 동의 (필수)</Text>
        </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => (openURL('https://sites.google.com/view/bowapp/%ED%99%88'))}>
        <Text style={{color : 'rgb(150,150,150)', fontWeight : 'bold'}}>{'>'}</Text>
        </TouchableOpacity>
      
      </View>

      <View style={styles.switchContainer}>
      <View style={{flexDirection : 'row', alignItems : "center"}}>
        <Switch thumbColor={privacyCheck ? theme.wiget22 : '#f4f3f4'}
        trackColor={{ false: '#767577', true: theme.wiget2 }}
        value={privacyCheck} onValueChange={setPrivacyCheck} />
        <TouchableOpacity onPress={() => (setPrivacyCheck(!privacyCheck))}>
        <Text style={styles.label}>개인정보 처리방침 동의 (필수)</Text>
        </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => (openURL('https://sites.google.com/view/bowapp/%ED%99%88'))}>
        <Text style={{color : 'rgb(150,150,150)', fontWeight : 'bold'}}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={submitButtonStyle}
        onPress={() => {
          agreePress();
        }}
      >
        <Text style={styles.submitButtonText}>가입하기</Text>
      </TouchableOpacity>
      </View>
     
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor : 'white',
    justifyContent : 'space-between'
    },
  switchContainer: {
    flexDirection: "row",
    justifyContent : 'space-between',
    alignItems : 'center',
    marginBottom: 10,
  },
  label: {
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    marginTop : 30,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
  },
});

const Logo = styled.Image`
  width: 200px;
  height: 200px;
  border-radius : 0px;
`;

export default JoinPresenter;
