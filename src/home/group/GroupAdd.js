import { Text, View } from "react-native";
import { useState, useContext, useEffect } from "react";
//import Container from "../../components/Container";
import styled, {ThemeContext} from 'styled-components/native';
import getEnvVars from '../../../environmant';
import { UserContext } from '../../contexts';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import { Alert } from 'react-native';

const GroupAdd = ({navigation}) => {
    const theme = useContext(ThemeContext);
    const { user }  = useContext(UserContext);
    const { apiUrl } = getEnvVars();
    const [inputData, SetInput] = useState([]);

  const joinPublicGroup = (index) => {
      axios({
        method : 'post',
        url: `${apiUrl}/api/group/join`,
        headers: {
          'Authorization': `${user.jwtToken}`
      },
      data: { group_id : index},
      }).then((response) => {
        console.log(response);
        Alert.alert(
          "안내",
          "가입 완료되었습니다",
          [
            { text: "확인" }
          ],
          { cancelable: false }
        );
         navigation.navigate('board1'); // 성공하면 이전 화면으로 돌아갑니다.
      }).catch(function (e) {
       // console.log(e);
        if (e.response) {
          // 서버가 2xx 외의 상태 코드로 응답한 경우
          switch(e.response.status) {
              case 403:
                  alert('권한이 없습니다.');
                  break;
              case 500:
                  alert('서버 에러가 발생했습니다.');
                  break;
              default:
                  alert('알 수 없는 에러가 발생했습니다.');
          }
      } else if (e.request) {
          // 요청은 만들어졌지만, 서버가 응답하지 않은 경우
          alert('서버로부터 응답이 없습니다.');
      } else {
          // 그 외에 어떤 것이든 요청을 설정하는 중에 오류가 발생한 경우
          alert('요청 생성 중에 오류가 발생했습니다.');
      }
      })
  }

  const createTwoButtonAlert = (name, group_id) =>
  Alert.alert(
    "그룹 가입하기",
    name+"에 가입하시겠습니까 ?",
    [
      {
        text: "아니오",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { text: "예", onPress: () => joinPublicGroup(group_id) }
    ],
    { cancelable: false }
  );

    useEffect(() => {
      const gets = async () => {
      try{
        const response = await axios.get(apiUrl+'/api/group/list', {
          headers: {
              'Authorization': `${user.jwtToken}`
          }
      });
      const _inputData = response.data.map((rowData) => ({
        group_id : rowData.group_id,
        group_name : rowData.group_name,
        group_description : rowData.group_description,
        is_password : rowData.is_password,
    }));
    SetInput(_inputData);
    console.log(inputData);
      }catch(e) {
        console.log("에러가 발생했습니다.", e)
      }
    }
    gets();
  }
      ,[]);
    
    return(
        <View style={{backgroundColor : theme.gray6, padding : 15}}>
          {inputData.map((group, index) => (
            <Container key={index} 
            style={{flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center'}}
            onPress={() => {
              if(group.is_password==0)
              createTwoButtonAlert(group.group_name, group.group_id)}}>
              <View >
                <Title>{group.group_name}</Title>
                <Content>{group.group_description}</Content>
              </View>
                {group.is_password==1 ? <AntDesign name="lock" size={24} color={theme.wiget32}/> : 
                <AntDesign name="unlock" size={24} color={theme.wiget22} />}
            </Container>
            ))}
      </View>
    )
}

const Container = styled.TouchableOpacity`
  align-content: center;
  border-radius: 10px;
  width: 100%;
  background-color: ${({ theme }) => theme.white};
  //border : 1px solid red;
  height: 80px;
  margin-bottom: 10px;
  flex-direction: column;
  padding: 10px;
`;

const Title = styled.Text`
  alignContent: center;
  height : 40%;
 font-size : 16px;
 font-weight : bold;
 margin-bottom : 7px;
`;
const Content = styled.Text`
  alignContent: center;
  height : 35%;
`;

const Footer = styled.Text`
  alignContent: center;
  font-size : 12px;
  margin-top : 10px;
  color : ${({ theme }) => theme.gray1};
`;

export default GroupAdd;