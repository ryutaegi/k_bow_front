import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import styled, { ThemeContext } from 'styled-components/native';
import { UserContext } from '../contexts';
import axios from 'axios';
import getEnvVars from '../../environmant';
import { ScrollView } from 'react-native-gesture-handler';

const UpdatePost = ({ route, navigation }) => {
  const theme = useContext(ThemeContext);
  const [title, setTitle] = useState(route.params.title);
  const [content, setContent] = useState(route.params.content);
  const { user }  = useContext(UserContext);
  const { apiUrl } = getEnvVars();
  const board_type = route.params.board_type;
  const board_id = route.params.board_id;
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
      url: `${apiUrl}/api/board/modify/${board_id}`,
      headers: {
        'Authorization': `${user.jwtToken}`
    },
    data: { title : title, content : content},
    }).then((response) => {
      navigation.navigate('board2', {board_type: board_type}); // 성공하면 이전 화면으로 돌아갑니다.
    }).catch(function (e) {
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
        // axios({
        //     method : 'post',
        //     url: API_URL+'api/board/create',
        //     headers: {
        //       'Authorization': `${user.jwtToken}`
        //   },
        //   data: { user_id : user.user_id, nickname : user.name, board_type : board_type, title : title, content : content},
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
    <ScrollView>
    <View style={{ padding: 20, height: theme.viewHeight * 0.8 }}>
      <Label>제목</Label>
      <StyledInput
        placeholder="게시글 제목"
        value={title}
        onChangeText={(text) => setTitle(text)}
        maxLength={MAX_TITLE_LENGTH} // 제목 최대 글자수 적용
      />
      <Text style={{marginBottom : 20, color : 'gray'}}>현재 글자수: {title.length}/{MAX_TITLE_LENGTH}</Text>
      <Label>내용</Label>
      <StyledInput
        placeholder="게시글 내용"
        value={content}
        onChangeText={(text) => setContent(text)}
        multiline
        maxLength={MAX_CONTENT_LENGTH} // 제목 최대 글자수 적용
      />
      <Text style={{marginBottom : 20, color : 'gray'}}>현재 글자수: {content.length}/{MAX_CONTENT_LENGTH}</Text>
      <SubmitButton onPress={handleSubmit}>
        <Text style={{ color: 'white' }}>수정</Text>
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

export default UpdatePost;
