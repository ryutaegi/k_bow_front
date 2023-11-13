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

const GroupDetail = ({ route, navigation }) => {
  const groupDetail_id = route.params.group_id;
  const theme = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const { apiUrl } = getEnvVars();
  const [inputData, SetInput] = useState([]);
  const [memberlist, SetMemberlist] = useState([]);
  const [userList, setUserList] = useState([]);
  const [countList, setCountList] = useState([]);
  
  




  useEffect(() => {
    const gets = async () => {
      try {
        const response = await axios.get(apiUrl + "/api/group/rank/"+groupDetail_id, {
          headers: {
            Authorization: `${user.jwtToken}`,
          },
        });
       console.log(response.data)
        const _inputData = response.data.sortedRatioResults.map((rowData) => ({
          user_id : rowData.user_id,
          nickname : rowData.nickname,
          // is_push : JSON.parse(response.is_push),
          // pushed_like_count : JSON.parse(response.pushed_like_count),
          average : rowData.ratio,
          //shot_day : rowData.elementCount,
        }));
        const __inputData = response.data.sortedElementCountResults.map((rowData) => ({
          user_id : rowData.user_id,
          nickname : rowData.nickname,
          // is_push : JSON.parse(response.is_push),
          // pushed_like_count : JSON.parse(response.pushed_like_count),
          
          shot_day : parseInt(rowData.elementCount),
        }));

        setUserList(_inputData);
       setCountList(__inputData);
        console.log(_inputData);
        console.log(__inputData);

      } catch (e) {
        console.log("에러가 발생했습니다.", e);
      }
    };
    gets();
  }, []);

  useEffect(() => {
    axios({
      method: "post",
      url: `${apiUrl}/api/group/list/memberdetail`,
      headers: {
        Authorization: `${user.jwtToken}`,
      },
      data: { group_id:  groupDetail_id},
    })
      .then((response) => {
        const _inputData = response.data.map((rowData) => ({
          user_id : rowData.user_id,
          image_URL : rowData.image_url,
          user_name : rowData.nickname,
        }));
        SetMemberlist(_inputData);
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
  }, []);

  return (
    <>
    <View style={{ backgroundColor: theme.white, padding: 15 }}>
    <RankingText>
        <RankingText1>  시수 순위</RankingText1>
        <TouchableOpacity onPress={() => {navigation.navigate('GroupAdd')}}>
       
        </TouchableOpacity>
        </RankingText>
      <HorizontalLine/>
      </View>
    <View style={{ backgroundColor: theme.white, padding: 15 }}>
      {userList.slice(0,3).map((group, index) => (
        <Container
          key={index}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          
        >
          
            <Title>{index+1}위 {group.nickname}</Title>
            <Content>평 {group.average}중</Content>
           
            
            {/* <AntDesign name="hearto" size={24} color="black" />
            <Text>
              {group.pushed_like_count}
            </Text> */}
            
            
          
        
        </Container>
      ))}
    
    </View>
    <View style={{ backgroundColor: theme.white, padding: 15 }}>
    <RankingText>
        <RankingText1>  습사 순위</RankingText1>
        <TouchableOpacity onPress={() => {navigation.navigate('GroupAdd')}}>
       
        </TouchableOpacity>
        </RankingText>
      <HorizontalLine/>
      </View>
    <View style={{ backgroundColor: theme.white, padding: 15 }}>
    {countList.slice(0,3).map((group, index) => (
        <Container
          key={index}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          
        >
          
            <Title>{index+1}위 {group.nickname}</Title>
            <Content> {group.shot_day}일 습사</Content>
            {/* <View>
            <AntDesign name="hearto" size={24} color="black" />
            <Text>
              {group.pushed_like_count}
            </Text>
            </View> */}
          
        
        </Container>
      ))}
    
    </View>
    <View style={{ backgroundColor: theme.white, padding: 15 }}>
    <CommunityText>
        <CommunityText1>  그룹원</CommunityText1>
        </CommunityText>
      <HorizontalLine/>
      </View>

    <View style={{ backgroundColor: theme.white, padding: 15, 
      flexDirection : "row", justifyContent : "space-around",
      flexWrap : 'wrap',
      }}>
        {memberlist.map((member, index) => (
          <View 
          key={member.user_id}
          style={{flexDirection : "column", alignItems : "center",
        marginLeft : 10,
        marginRight : 10,}}>
          <MemberPrifile source={{uri : member.image_URL}}></MemberPrifile>
          <Text style={{marginTop : 5, fontWeight : 'bold'}}>{member.user_name}</Text>
          </View>
        ))}
         
          
          
          
          

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

const RankingText = styled.View`
flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  top : 0px;
  margin-bottom : 3px;
  
`;

const RankingText1 = styled.Text`
color : ${({ theme }) => theme.black};
  font-size : 16px;

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
