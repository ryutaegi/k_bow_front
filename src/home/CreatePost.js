import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, KeyboardAvoidingView } from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
import { UserContext } from '../contexts';
import axios from 'axios';
import getEnvVars from '../../environmant';
import { ScrollView } from 'react-native-gesture-handler';



const CreatePost = ({ route, navigation }) => {
  const theme = useContext(ThemeContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { user }  = useContext(UserContext);
  const { apiUrl } = getEnvVars();
  const board_type = route.params.board_type;
  const MAX_TITLE_LENGTH = 50;
  const MAX_CONTENT_LENGTH = 1000;


  const isValidUTF8Char = (char) => {
    const codePoint = char.codePointAt(0);
    return codePoint <= 0x10FFFF; // utf8 문자셋은 U+0000부터 U+10FFFF까지의 유니코드 코드 포인트를 포함합니다.
};

  const handleSubmit = async () => {
    if(title.trim() === '' || content.trim() === '') {
        alert('제목과 내용을 모두 입력해주세요.');
        return;
    }
    // utf8 문자셋 외의 문자가 있는지 확인
    const isInvalidTitle = [...title].some(char => !isValidUTF8Char(char));
    const isInvalidContent = [...content].some(char => !isValidUTF8Char(char));

    if(isInvalidTitle || isInvalidContent) {
        alert('유효하지 않은 문자가 포함되어 있습니다. utf8 문자만 사용 가능합니다.');
        return;
    }
        axios({
            method : 'post',
            url: apiUrl+ '/api/board/create',
            headers: {
              'Authorization': `${user.jwtToken}`
          },
          data: { board_type : board_type, title : title, content : content},
          }).then((response) => {
            navigation.navigate('board2', {board_type: board_type}); // 성공하면 이전 화면으로 돌아갑니다.
          }).catch(function (error) {
            console.error('게시글 작성 중 에러 발생:', error);
            if (error.response && error.response.data && error.response.data.error) {
                Alert.alert("안내",error.response.data.error); // 서버로부터 받은 오류 메시지를 알림으로 표시
            } else {
                alert('Unknown error occurred'); // 알 수 없는 오류
            }
          })
   
  };

  return (
    <ScrollView>
      
    <View style={{ padding: 20, }}>
      <Label>제목</Label>
      <StyledInput
        placeholder="게시글 제목을 입력해주세요"
        value={title}
        onChangeText={(text) => setTitle(text)}
        maxLength={MAX_TITLE_LENGTH} // 제목 최대 글자수 적용
      />
      <Text style={{marginBottom : 20, color : 'gray'}}>현재 글자수: {title.length}/{MAX_TITLE_LENGTH}</Text>
      <Label>내용</Label>
      <StyledInput
        placeholder="게시글 내용을 입력해주세요"
        value={content}
        onChangeText={(text) => setContent(text)}
        multiline
        maxLength={MAX_CONTENT_LENGTH} // 내용 최대 글자수 적용
        
      />
      <Text style={{marginBottom : 20, color : 'gray'}}>현재 글자수: {content.length}/{MAX_CONTENT_LENGTH}</Text>
      <SubmitButton onPress={handleSubmit}>
        <Text style={{ color: 'white' }}>등록</Text>
      </SubmitButton>
    </View>
    
    </ScrollView>
  );
};

const Label = styled.Text`
  font-size: 16px;
  margin-bottom: 5px;
`;

const StyledInput = styled.TextInput`
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 0px;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.wiget22};
  padding: 10px;
  align-items: center;
  border-radius: 5px;
`;

export default CreatePost;
