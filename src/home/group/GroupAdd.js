import {
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import { useState, useContext, useEffect } from "react";
//import Container from "../../components/Container";
import styled, { ThemeContext } from "styled-components/native";
import getEnvVars from "../../../environmant";
import { UserContext } from "../../contexts";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { CardRowTitleContent2 } from "../../equipment/card";
import { Input } from "react-native-elements";

const GroupAdd = ({ navigation }) => {
  const theme = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const { apiUrl } = getEnvVars();
  const [inputData, SetInput] = useState([]);
  const [promptVisible, setPromptVisible] = useState(false);
  const [press_group_id, setPress_group_id] = useState(-1);
  const [page, setPage] = useState(1); // 현재 페이지 번호
  const [select, setSelect] = useState("");

  const handlePasswordSubmit = (password) => {
    // 비밀번호를 처리합니다.
    console.log("Entered password:", password);
    console.log("group_id", press_group_id);

    axios({
      method: "post",
      url: `${apiUrl}/api/group/join/private`,
      headers: {
        Authorization: `${user.jwtToken}`,
      },
      data: { group_id: press_group_id, group_password: password },
    })
      .then((response) => {
        console.log(response);
        Alert.alert("안내", "가입 완료되었습니다", [{ text: "확인" }], {
          cancelable: false,
        });
        navigation.navigate("홈"); // 성공하면 이전 화면으로 돌아갑니다.
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

    // 비밀번호 모달을 닫습니다.
    setPromptVisible(false);
  };

  const PasswordPrompt = ({ isVisible, onClose, onSubmit }) => {
    const [password, setPassword] = useState("");

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {/* <TextInput
              secureTextEntry
              style={styles.textInput}
              placeholder="비밀번호를 입력하세요."
              value={password}
              onChangeText={setPassword}
            /> */}
            <Input label="비밀번호를 입력하세요" value={setPassword} />
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.wiget22 }]}
              onPress={() => onSubmit(password)}
            >
              <Text style={styles.buttonText}>완료</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "gray" }]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, {color : 'white'}]}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  

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
        navigation.navigate("홈"); // 성공하면 이전 화면으로 돌아갑니다.
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

  const fetchGroups = async () => {
    try {
      const response = await axios.get(apiUrl + "/api/group/list", {
        headers: {
          Authorization: `${user.jwtToken}`,
        },
        params: { page: page }, // 페이지 번호를 파라미터로 전달
      });
      const newInputData = response.data.map((rowData) => ({
        group_id: rowData.group_id,
        group_name: rowData.group_name,
        group_description: rowData.group_description,
        is_password: rowData.is_password,
      }));
      SetInput((prevInputData) => [...prevInputData, ...newInputData]); // 기존 데이터에 새로운 데이터 추가
      console.log(inputData);
    } catch (e) {
      console.log("에러가 발생했습니다.", e);
    }
  };

  // useEffect(() => {
  //   const gets = async () => {
  //     try {
  //       const response = await axios.get(apiUrl + "/api/group/list", {
  //         headers: {
  //           Authorization: `${user.jwtToken}`,
  //         },
  //       });
  //       const _inputData = response.data.map((rowData) => ({
  //         group_id: rowData.group_id,
  //         group_name: rowData.group_name,
  //         group_description: rowData.group_description,
  //         is_password: rowData.is_password,
  //       }));
  //       SetInput(_inputData);
  //       console.log(inputData);
  //     } catch (e) {
  //       console.log("에러가 발생했습니다.", e);
  //     }
  //   };
  //   gets();
  // }, []);

  useEffect(() => {
    fetchGroups();
  }, [page]);

  const loadMoreGroups = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const selectGroup = () => {
    if(select.length > 0){
      console.log(select)
    axios({
      method: "post",
      url: `${apiUrl}/api/group/select`,
      headers: {
        Authorization: `${user.jwtToken}`,
      },
      data: { title: select},
    })
      .then((response) => {
        console.log(response);
        console.log("data",response.data.length);
        console.log("data[0]",response.data[0].length);
        if(response.data.length > 0)
        {
        if(response.data[0].is_password == 1) //비공개 그룹
        {
            setPromptVisible(true);
            setPress_group_id(response.data[0].group_id);
        }
        else if(response.data[0].is_password == 0){ //공개 그룹
          createTwoButtonAlert(select, response.data[0].group_id);
        } 
      }else {
        console.log("그룹이 존재하지 않습니다.")
      }
       
        
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
          Alert.alert("안내", "그룹이 존재하지 않습니다.");
        }
      });
    }
  };

  return (
    <View style={{ backgroundColor: theme.white, padding: 0 }}>
      <View style={{marginTop : 10, padding : 10, paddingBottom : 0, flexDirection : 'row', alignItems : 'center'}}>
        <View style={{flex : 0.8}}>
      <Input label="그룹 검색"  placeholder="그룹 이름을 입력하세요" onChangeText={setSelect} />
      </View>
      <TouchableOpacity
      onPress={() => {selectGroup()}}
       style={[styles.cardContainer, {
       flex : 0.2,
        height : 37,
        backgroundColor : theme.wiget22,
        alignItems : 'center',
        justifyContent : 'center'
        
        

      }]}>
        <Text style={{color : 'white', fontWeight : 'bold'}}>
          가입하기
        </Text>
      </TouchableOpacity>
      </View>
  <FlatList
  contentContainerStyle={{ paddingBottom: 100 }}
    data={inputData}
    renderItem={({ item, index }) => (
      <CardRowTitleContent2
        onPress={() => {
          if (item.is_password == 0)
            createTwoButtonAlert(item.group_name, item.group_id);
          else {
            setPromptVisible(true);
            setPress_group_id(item.group_id);
          }
        }}
        heading={item.group_name}
        description={item.group_description}
        ispublic={item.is_password}
      />
    )}
    keyExtractor={(item, index) => index.toString()}
    onEndReached={loadMoreGroups}
    onEndReachedThreshold={0.5}
  />
  <PasswordPrompt
    isVisible={promptVisible}
    onClose={() => setPromptVisible(false)}
    onSubmit={handlePasswordSubmit}
  />
</View>


    // <View style={{ backgroundColor: theme.white, padding: 0 }}>
    //   <ScrollView>
    //   {inputData.map((group, index) => (
    //     <CardRowTitleContent2
    //     keys={index}
    //     onPress={() => {
    //       if (group.is_password == 0)
    //         createTwoButtonAlert(group.group_name, group.group_id);
    //       else
    //       {
    //          setPromptVisible(true);
    //          setPress_group_id(group.group_id);
    //       }
    //     }}
    //     heading={group.group_name}
    //     description={group.group_description}
    //     ispublic={group.is_password}
    //     />

    //   ))}
    // <PasswordPrompt
    //   isVisible={promptVisible}
    //   onClose={() => setPromptVisible(false)}
    //   onSubmit={handlePasswordSubmit}
    // />
    //   </ScrollView>
    // </View>
  );
};

const styles = StyleSheet.create({
    cardContainer: {
      backgroundColor: "#ffffff",
      borderRadius: 8,
      
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      marginBottom: 10,
    },
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
  elevation: 5;
`;

const Title = styled.Text`
  height: 40%;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 7px;
`;
const Content = styled.Text`
  height: 35%;
`;

const Footer = styled.Text`
  font-size: 12px;
  margin-top: 10px;
  color: ${({ theme }) => theme.gray1};
`;

export default GroupAdd;
