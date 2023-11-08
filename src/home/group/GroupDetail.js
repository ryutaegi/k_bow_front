import {
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { useState, useContext, useEffect } from "react";
//import Container from "../../components/Container";
import styled, { ThemeContext } from "styled-components/native";
import getEnvVars from "../../../environmant";
import { UserContext } from "../../contexts";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { Alert } from "react-native";

const GroupDetail = ({ navigation }) => {
  const theme = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const { apiUrl } = getEnvVars();
  const [inputData, SetInput] = useState([]);
  const [promptVisible, setPromptVisible] = useState(false);
  const [press_group_id, setPress_group_id] = useState(-1);


  const joinPublicGroup = (index) => {
    axios({
      method: "post",
      url: `${apiUrl}/api/group/join/public`,
      headers: {
        Authorization: `${user.jwtToken}`,
      },
      data: { group_id: index },
    })
      .then((response) => {
        console.log(response);
        Alert.alert("안내", "가입 완료되었습니다", [{ text: "확인" }], {
          cancelable: false,
        });
        navigation.navigate("board1"); // 성공하면 이전 화면으로 돌아갑니다.
      })
      .catch(function (e) {
        // console.log(e);
        if (e.response) {
          // 서버가 2xx 외의 상태 코드로 응답한 경우
          switch (e.response.status) {
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
          Alert.alert("안내", "서버로부터 응답이 없습니다.");
        } else {
          // 그 외에 어떤 것이든 요청을 설정하는 중에 오류가 발생한 경우
          Alert.alert("안내", "요청 생성 중에 오류가 발생했습니다.");
        }
      });
  };

  const createTwoButtonAlert = (name, group_id) =>
    Alert.alert(
      "그룹 가입하기",
      name + "에 가입하시겠습니까 ?",
      [
        {
          text: "아니오",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "예", onPress: () => joinPublicGroup(group_id) },
      ],
      { cancelable: false }
    );

  useEffect(() => {
    const gets = async () => {
      try {
        const response = await axios.get(apiUrl + "/api/group/list", {
          headers: {
            Authorization: `${user.jwtToken}`,
          },
        });
        const _inputData = response.data.map((rowData) => ({
          group_id: rowData.group_id,
          group_name: rowData.group_name,
          group_description: rowData.group_description,
          is_password: rowData.is_password,
        }));
        SetInput(_inputData);
        console.log(inputData);
      } catch (e) {
        console.log("에러가 발생했습니다.", e);
      }
    };
    gets();
  }, []);

  return (
    <>
    <View style={{ backgroundColor: theme.gray6, padding: 15 }}>
      {inputData.map((group, index) => (
        <Container
          key={index}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onPress={() => {
            if (group.is_password == 0)
              createTwoButtonAlert(group.group_name, group.group_id);
            else
            {
               setPromptVisible(true);
               setPress_group_id(group.group_id);
            }
          }}
        >
          
            <Title>{index+1}위 {group.group_name}</Title>
            <Content>{group.group_description}</Content>
          
        
        </Container>
      ))}
    
    </View>
    <View style={{ backgroundColor: theme.gray6, padding: 15 }}>
      {inputData.map((group, index) => (
        <Container
          key={index}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onPress={() => {
            if (group.is_password == 0)
              createTwoButtonAlert(group.group_name, group.group_id);
            else
            {
               setPromptVisible(true);
               setPress_group_id(group.group_id);
            }
          }}
        >
          
            <Title>{index+1}위 {group.group_name}</Title>
            <Content>{group.group_description}</Content>
          
        
        </Container>
      ))}
    
    </View>
    <View style={{ backgroundColor: theme.gray6, padding: 15 }}>
    <CommunityText>
        <CommunityText1>  그룹원</CommunityText1>
        <TouchableOpacity onPress={() => {navigation.navigate('GroupAdd')}}>
        <Text style={{color:'gray'}}>추가하기 </Text>
        </TouchableOpacity>
        </CommunityText>
      <HorizontalLine/>
      </View>

    <View style={{ backgroundColor: theme.gray6, padding: 15, flexDirection : "row" }}>
          <View style={{flexDirection : "column", alignItems : "center"}}>
          <MemberPrifile source={{uri: user.imageURL}}></MemberPrifile>
          <Text>{user.name}</Text>
          </View>
          
          

    </View>
    </>
  );
};

const styles = StyleSheet.create({
  // ... other styles remain the same
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textInput: {
    height: 40,
    width: 180,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 10,
    margin: 10,
    marginBottom: 0,
    width: 160,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  // ... other styles remain the same
});

const MemberPrifile = styled.Image`
width : 70px;
height : 70px;
border-radius : 50px;
background-color : ${({theme}) => theme.wiget22}
`;

const HorizontalLine = styled.View`
width : 100%;
border-bottom-width: 0.85px;
border-bottom-color: ${({ theme }) => theme.gray2};
margin-vertical: 3px; 
`;

const CommunityText = styled.View`
flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  top : 0px;
  margin-bottom : 3px;
  
`;

const CommunityText1 = styled.Text`
color : ${({ theme }) => theme.black};
  font-size : 18px;
  font-weight : bold;
  `;

const Container = styled.TouchableOpacity`
  align-content: center;
  border-radius: 10px;
  width: 100%;
  background-color: ${({ theme }) => theme.white};
  //border : 1px solid red;
  height: 30px;
  margin-bottom: 10px;
  flex-direction: column;
  padding-left: 10px;
  padding-right : 10px;
  elevation: 5;
`;

const Title = styled.Text`
  aligncontent: center;
  
  font-size: 13px;
  font-weight: bold;

`;
const Content = styled.Text`
 font-size : 11px;
`;

const Footer = styled.Text`

  font-size: 12px;
  margin-top: 10px;
  color: ${({ theme }) => theme.gray1};
`;

export default GroupDetail;
