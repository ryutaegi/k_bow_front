import { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Linking, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Modal, Pressable } from 'react-native';
import { UserContext } from '../contexts';
import axios from 'axios';
import getEnvVars from '../../environmant';

const BOARD_COLORS = { 1: '#32B5C6', 2: '#059BF4', 3: '#058549', 4: '#F56412' };

const Notice_detail = ({ route, navigation }) => {
  const { apiUrl } = getEnvVars;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [user_name, setUser_name] = useState('');
  const [board_time, setBoard_time] = useState('');
  const [maker_id, setMaker_id] = useState(0);
  const { user } = useContext(UserContext);
  const board_type = route.params.board_type;
  const board_id = route.params.board_id;
  const [menuOpen, setMenuOpen] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  const accentColor = BOARD_COLORS[board_type] || '#059BF4';
  const initial = user_name ? user_name.charAt(0) : '?';

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/board/comment/${board_id}`, {
        headers: { Authorization: `${user.jwtToken}` }
      });
      setComments(res.data.comments);
    } catch (e) { console.log(e); }
  };

  const submitComment = async () => {
    if (!commentText.trim()) return;
    try {
      await axios.post(
        `${apiUrl}/api/board/comment/${board_id}`,
        { content: commentText },
        { headers: { Authorization: `${user.jwtToken}` } }
      );
      setCommentText('');
      fetchComments();
    } catch (e) { console.log(e); }
  };

  const deleteComment = async (comment_id) => {
    Alert.alert('삭제', '댓글을 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제', style: 'destructive', onPress: async () => {
          try {
            await axios.post(
              `${apiUrl}/api/board/comment/delete/${comment_id}`,
              {},
              { headers: { Authorization: `${user.jwtToken}` } }
            );
            fetchComments();
          } catch (e) { console.log(e); }
        }
      }
    ]);
  };

  const toggleLike = async () => {
    try {
      const res = await axios.post(`${apiUrl}/api/board/like/${board_id}`, {}, {
        headers: { Authorization: `${user.jwtToken}` }
      });
      setLiked(res.data.liked);
      setLikeCount(prev => res.data.liked ? prev + 1 : prev - 1);
    } catch (e) { console.log(e); }
  };

  const sendEmail = () => {
    const email = 'rtg1021t@google.com';
    const subject = encodeURIComponent('[활로 게시글 신고] 게시글 id : ' + board_id);
    const body = encodeURIComponent("게시글 제목 : " + title + "\n게시글 내용 : " + content + "\n신고 사유 : ");
    Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`)
      .catch(err => console.error('이메일 보내기 에러:', err));
  };

  const delete_post = async () => {
    try {
      await axios.post(`${apiUrl}/api/board/delete/${board_id}`, {}, {
        headers: { Authorization: `${user.jwtToken}` }
      });
      navigation.navigate('board2', { board_type });
    } catch (e) {
      if (e.response) {
        switch (e.response.status) {
          case 403: alert('권한이 없습니다.'); break;
          case 500: alert('서버 에러가 발생했습니다.'); break;
          default: alert('알 수 없는 에러가 발생했습니다.');
        }
      } else if (e.request) {
        alert('서버로부터 응답이 없습니다.');
      } else {
        alert('요청 생성 중에 오류가 발생했습니다.');
      }
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(apiUrl + '/api/board/detail/' + board_id, {
          headers: { Authorization: `${user.jwtToken}` }
        });
        setUser_name(response.data[0].nickname);
        setBoard_time(response.data[0].created_at_korean);
        setTitle(response.data[0].title);
        setContent(response.data[0].content);
        setMaker_id(response.data[0].user_id);

        const likeRes = await axios.get(`${apiUrl}/api/board/like/${board_id}`, {
          headers: { Authorization: `${user.jwtToken}` }
        });
        setLikeCount(likeRes.data.like_count);
        setLiked(likeRes.data.liked);
      } catch (e) { console.log(e); }
    };
    fetchPosts();
    fetchComments();
  }, []);

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* 작성자 헤더 */}
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: accentColor }]}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.writer}>{user_name}</Text>
            <Text style={styles.date}>
              {board_time ? `${board_time.slice(0, 10)}  ${board_time.slice(11, 16)}` : ''}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setMenuOpen(true)} style={styles.menuButton}>
            <Text style={styles.menuDots}>⋮</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

        {/* 본문 */}
        <View style={styles.body}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.content}>{content}</Text>

          <TouchableOpacity onPress={toggleLike} style={styles.likeButton}>
            <Text style={styles.likeIcon}>{liked ? '❤️' : '🤍'}</Text>
            <Text style={styles.likeCount}>{likeCount}</Text>
          </TouchableOpacity>
        </View>

        {/* 댓글 섹션 */}
        <View style={styles.commentSection}>
          <Text style={styles.commentHeader}>댓글 {comments.length}개</Text>

          {comments.map(c => (
            <View key={c.comment_id} style={styles.commentItem}>
              <View style={styles.commentTop}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={[styles.commentAvatar, { backgroundColor: accentColor }]}>
                    <Text style={styles.commentAvatarText}>{c.nickname.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text style={styles.commentNickname}>{c.nickname}</Text>
                    <Text style={styles.commentDate}>
                      {c.created_at_korean ? c.created_at_korean.slice(0, 16) : ''}
                    </Text>
                  </View>
                </View>
                {c.user_id === user.user_id && (
                  <TouchableOpacity onPress={() => deleteComment(c.comment_id)}>
                    <Text style={styles.commentDelete}>삭제</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.commentContent}>{c.content}</Text>
            </View>
          ))}

          {comments.length === 0 && (
            <Text style={styles.emptyComment}>첫 댓글을 남겨보세요!</Text>
          )}
        </View>
      </ScrollView>

      {/* 댓글 입력창 */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.commentInputRow}>
          <View style={styles.commentInputWrap}>
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="댓글을 입력하세요"
              maxLength={500}
              style={styles.commentInput}
              multiline
            />
            {commentText.length > 400 && (
              <Text style={styles.commentCounter}>{commentText.length}/500</Text>
            )}
          </View>
          <TouchableOpacity
            onPress={submitComment}
            style={[styles.commentSubmit, { backgroundColor: accentColor }]}
          >
            <Text style={styles.commentSubmitText}>등록</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* 점 3개 드롭다운 메뉴 */}
      <Modal transparent visible={menuOpen} animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={styles.menuOverlay} onPress={() => setMenuOpen(false)}>
          <View style={styles.menuBox}>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuOpen(false); sendEmail(); }}>
              <Text style={styles.menuItemText}>신고</Text>
            </TouchableOpacity>
            {user.user_id === maker_id && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  navigation.navigate('update_post', { board_type, board_id, title, content });
                }}
              >
                <Text style={styles.menuItemText}>수정</Text>
              </TouchableOpacity>
            )}
            {user.user_id === maker_id && (
              <TouchableOpacity
                style={[styles.menuItem, styles.menuItemLast]}
                onPress={() => {
                  setMenuOpen(false);
                  Alert.alert('삭제', '게시글을 삭제할까요?', [
                    { text: '취소', style: 'cancel' },
                    { text: '삭제', style: 'destructive', onPress: delete_post },
                  ]);
                }}
              >
                <Text style={[styles.menuItemText, { color: '#e53935' }]}>삭제</Text>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  writer: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#aaa',
  },
  accentBar: {
    height: 3,
    width: '100%',
  },
  body: {
    backgroundColor: '#fff',
    marginTop: 10,
    marginHorizontal: 14,
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    lineHeight: 26,
  },
  content: {
    fontSize: 15,
    color: '#444',
    lineHeight: 24,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  likeIcon: {
    fontSize: 22,
  },
  likeCount: {
    marginLeft: 6,
    fontSize: 15,
    color: '#666',
  },
  commentSection: {
    marginTop: 10,
    marginHorizontal: 14,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  commentHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  commentItem: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
  },
  commentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentAvatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  commentNickname: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  commentDate: {
    fontSize: 11,
    color: '#aaa',
  },
  commentContent: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    paddingLeft: 38,
  },
  commentDelete: {
    fontSize: 12,
    color: '#e53935',
  },
  emptyComment: {
    textAlign: 'center',
    color: '#bbb',
    paddingVertical: 16,
    fontSize: 14,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  commentInputWrap: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    backgroundColor: '#fafafa',
  },
  commentInput: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
    fontSize: 14,
    maxHeight: 100,
  },
  commentCounter: {
    fontSize: 11,
    color: '#e53935',
    textAlign: 'right',
    paddingHorizontal: 10,
    paddingBottom: 6,
  },
  commentSubmit: {
    marginLeft: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  commentSubmitText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  menuButton: {
    padding: 6,
  },
  menuDots: {
    fontSize: 22,
    color: '#555',
    lineHeight: 26,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  menuBox: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    minWidth: 120,
    overflow: 'hidden',
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    fontSize: 15,
    color: '#1a1a1a',
  },
});

export default Notice_detail;
