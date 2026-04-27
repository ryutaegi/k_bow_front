import { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { UserContext } from '../../contexts';
import getEnvVars from '../../../environmant';

const ACCENT = '#5B8DEF';
const MAX_TITLE = 50;
const MAX_CONTENT = 1000;

const GroupBoardCreate = ({ route, navigation }) => {
  const { group_id } = route.params;
  const { user } = useContext(UserContext);
  const { apiUrl } = getEnvVars;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('안내', '제목과 내용을 모두 입력해주세요.');
      return;
    }
    try {
      await axios.post(
        `${apiUrl}/api/group/board/create`,
        { group_id, title, content },
        { headers: { Authorization: `${user.jwtToken}` } }
      );
      navigation.goBack();
    } catch (e) {
      const msg = e.response?.data?.error || '서버 에러가 발생했습니다.';
      Alert.alert('안내', msg);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.label}>제목</Text>
      <TextInput
        style={styles.input}
        placeholder="제목을 입력해주세요"
        value={title}
        onChangeText={setTitle}
        maxLength={MAX_TITLE}
      />
      <Text style={styles.counter}>{title.length}/{MAX_TITLE}</Text>

      <Text style={styles.label}>내용</Text>
      <TextInput
        style={[styles.input, styles.contentInput]}
        placeholder="내용을 입력해주세요"
        value={content}
        onChangeText={setContent}
        maxLength={MAX_CONTENT}
        multiline
      />
      <Text style={styles.counter}>{content.length}/{MAX_CONTENT}</Text>

      <TouchableOpacity style={[styles.submitBtn, { backgroundColor: ACCENT }]} onPress={handleSubmit}>
        <Text style={styles.submitText}>등록</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  label: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 6, marginTop: 10 },
  input: {
    borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 14,
    backgroundColor: '#fafafa',
  },
  contentInput: { height: 200, textAlignVertical: 'top' },
  counter: { fontSize: 12, color: '#bbb', textAlign: 'right', marginTop: 4, marginBottom: 8 },
  submitBtn: {
    marginTop: 20, paddingVertical: 14, borderRadius: 10, alignItems: 'center',
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default GroupBoardCreate;
