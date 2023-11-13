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
import { ButtonGroup } from '@rneui/themed'

const GroupMake = ({ navigation }) => {
  const theme = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const { apiUrl } = getEnvVars();
  const [inputData, SetInput] = useState([]);
  const [promptVisible, setPromptVisible] = useState(false);
  const [press_group_id, setPress_group_id] = useState(-1);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [password, setPassword] = useState('');

  const [selectedIndex, setSelectedIndex] = useState(0);
const [selectedIndexes, setSelectedIndexes] = useState([0]);

  const isValidUTF8Char = (char) => {
    const codePoint = char.codePointAt(0);
    return codePoint <= 0x10FFFF; // utf8 문자셋은 U+0000부터 U+10FFFF까지의 유니코드 코드 포인트를 포함합니다.
};

  const handleSubmit = async () => {
    if(selectedIndex==1){
    if(title.trim() === '' || content.trim() === '' || password.trim() === '') {
        Alert.alert('안내','그룹 이름, 설명, 비밀번호를 모두 입력해주세요.');
        return;
    }
  } else{
    if(title.trim() === '' || content.trim() === '') {
      Alert.alert('안내','그룹 이름, 설명을 모두 입력해주세요.');
      return;
  }
  }
    // utf8 문자셋 외의 문자가 있는지 확인
    const isInvalidTitle = [...title].some(char => !isValidUTF8Char(char));
    const isInvalidContent = [...content].some(char => !isValidUTF8Char(char));

    if(isInvalidTitle || isInvalidContent) {
        alert('유효하지 않은 문자가 포함되어 있습니다. utf8 문자만 사용 가능합니다.');
        return;
    }
        // axios({
        //     method : 'post',
        //     url: apiUrl+ '/api/board/create',
        //     headers: {
        //       'Authorization': `${user.jwtToken}`
        //   },
        //   data: { board_type : board_type, title : title, content : content},
        //   }).then((response) => {
        //     navigation.navigate('board2', {board_type: board_type}); // 성공하면 이전 화면으로 돌아갑니다.
        //   }).catch(function (error) {
        //     console.error('게시글 작성 중 에러 발생:', error);
        //     if (error.response && error.response.data && error.response.data.error) {
        //         alert(error.response.data.error); // 서버로부터 받은 오류 메시지를 알림으로 표시
        //     } else {
        //         alert('Unknown error occurred'); // 알 수 없는 오류
        //     }
        //   })
   
  };
  
  return (
   <>
   <View style={{ padding: 20, height: theme.viewHeight * 0.8 }}>
      <Label>그룹 이름</Label>
      <StyledInput
        placeholder="그룹 이름을 입력하세요"
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      <Label>그룹 설명</Label>
      <StyledInput
        placeholder="그룹 설명을 입력하세요"
        value={content}
        onChangeText={(text) => setContent(text)}
        multiline
      />
      <ButtonGroup
      selectedButtonStyle={{backgroundColor : theme.wiget22}}
      buttons={['공개 그룹', '비공개 그룹']}
      selectedIndex={selectedIndex}
      onPress={(value) => {
        setSelectedIndex(value);
        console.log(value);
      }}
      containerStyle={{ marginBottom: 20 }}
    />
    {selectedIndex == 1 ? <StyledInput
        placeholder="그룹 비밀번호를 입력하세요"
        value={password}
        onChangeText={(text) => setPassword(text)}
        multiline
      />
    :
    null}

      <SubmitButton onPress={handleSubmit}>
        <Text style={{ color: 'white' }}>그룹 생성</Text>
      </SubmitButton>
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

const Label = styled.Text`
  font-size: 16px;
  margin-bottom: 5px;
`;

const StyledInput = styled.TextInput`
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 20px;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.wiget22};
  padding: 10px;
  align-items: center;
  border-radius: 5px;
`;

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
  aligncontent: center;
  height: 40%;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 7px;
`;
const Content = styled.Text`
  aligncontent: center;
  height: 35%;
`;

const Footer = styled.Text`
  aligncontent: center;
  font-size: 12px;
  margin-top: 10px;
  color: ${({ theme }) => theme.gray1};
`;

export default GroupMake;
