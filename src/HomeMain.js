import React, { useContext, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert, Linking, Dimensions } from 'react-native';
import axios from 'axios';
import { Text } from 'react-native-elements';
import styled, {ThemeContext} from 'styled-components/native';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { UserContext } from './contexts';
import getEnvVars from '../environmant';
import { useFocusEffect } from '@react-navigation/native';
import { CustomCard } from './equipment/card';

const windowWidth = Dimensions.get('window').width;

const BOARD_TYPE_COLOR = { 1: 'rgb(50,181,198)', 2: 'rgb(5,155,244)', 3: 'rgb(5,133,73)', 4: 'rgb(245,100,18)' };
const GROUP_COLORS = ['#5B8DEF', '#F4845F', '#4CAF82', '#9B72CF', '#E8A838', '#3BBFBF'];

const HomeMain = ( {navigation} ) => {
  const theme = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const [inputData, SetInput] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const { apiUrl } = getEnvVars;

  const sendEmail = () => {
    const email = 'rtg1021t@google.com';
    const subject = encodeURIComponent('[활로 기능추가 건의]');
    const body = encodeURIComponent("건의내용 : ");
    const emailUrl = `mailto:${email}?subject=${subject}&body=${body}`;
    Linking.openURL(emailUrl).catch(err => console.error('이메일 보내기 에러:', err));
  };

  const rerend = () => {
    console.log("user",user.user_id)
    if((user.user_id !== null) && (user.user_id !== undefined))
    {
    axios({
      method: "get",
      url: `${apiUrl}/api/group/join/list`,
      headers: {
        Authorization: `${user.jwtToken}`,
      },
    })
      .then((response) => {
        console.log(response.data);
        const _inputData = response.data.map((rowData) => ({
          group_id: rowData.group_id,
          group_name: rowData.group_name,
          group_description: rowData.group_description,
          group_maker_id : rowData.group_maker_id,
          is_password: rowData.is_password,
        }));
        SetInput(_inputData);
      })
      .catch(function (e) {
        if (e.response) {
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
          Alert.alert("안내", "서버로부터 응답이 없습니다.");
        } else {
          Alert.alert("안내", "요청 생성 중에 오류가 발생했습니다.");
        }
      });
    }
    else{
      SetInput([]);
    }
  }

  const fetchRecentPosts = () => {
    if (user.user_id == null) return;
    axios.get(`${apiUrl}/api/board/popular`, { headers: { Authorization: `${user.jwtToken}` } })
      .then(res => setRecentPosts(res.data))
      .catch(() => {});
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log("focus");
      rerend();
      fetchRecentPosts();
    }, [user])
  );

  useEffect(()=> {
    rerend();
    fetchRecentPosts();
  }, [user])

  const communityItems = [
    { icon: <AntDesign name="notification" size={26} color={theme.wiget11} />, label: '공지', bg: theme.wiget1, type: 1 },
    { icon: <FontAwesome name="pencil-square-o" size={26} color={theme.wiget22} />, label: '자유', bg: theme.wiget2, type: 2 },
    { icon: <AntDesign name="bells" size={26} color={theme.wiget32} />, label: '홍보', bg: theme.wiget3, type: 4 },
    { icon: <AntDesign name="info" size={26} color={theme.wiget42} />, label: '정보', bg: theme.wiget4, type: 3 },
  ];

    return (
      <ScrollView style={{ backgroundColor: '#f5f6fa' }} showsVerticalScrollIndicator={false}>

        {/* 상단 퀵메뉴 */}
        <ScrollView
          style={{ marginTop: 20 }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 4 }}
        >
          <QuickCard onPress={() => navigation.navigate('notice_detail', { board_type: 1, board_id: 1 })}>
            <QuickIconBox style={{ backgroundColor: theme.blue1 }}>
              <Feather name="book-open" size={26} color={theme.blue5} />
            </QuickIconBox>
            <QuickTextBox>
              <QuickTitle>활로가 처음이라면</QuickTitle>
              <QuickSub style={{ color: theme.blue5 }}>활로 안내 →</QuickSub>
            </QuickTextBox>
          </QuickCard>

          <QuickCard onPress={() => Linking.openURL("http://kungdo.or.kr/bbs/board.php?bo_table=game_news")}>
            <QuickIconBox style={{ backgroundColor: '#ffe5e5' }}>
              <AntDesign name="Trophy" size={26} color={theme.red} />
            </QuickIconBox>
            <QuickTextBox>
              <QuickTitle>대회 일정</QuickTitle>
              <QuickSub style={{ color: theme.red }}>바로가기 →</QuickSub>
            </QuickTextBox>
          </QuickCard>

          <QuickCard onPress={sendEmail}>
            <QuickIconBox style={{ backgroundColor: theme.blue2 }}>
              <Feather name="alert-triangle" size={26} color={theme.blue3} />
            </QuickIconBox>
            <QuickTextBox>
              <QuickTitle>기능 추가</QuickTitle>
              <QuickSub style={{ color: theme.blue3 }}>건의하기 →</QuickSub>
            </QuickTextBox>
          </QuickCard>
        </ScrollView>

        {/* 커뮤니티 + 최근 게시글 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>커뮤니티</Text>
          <View style={styles.communityRow}>
            {communityItems.map((item) => (
              <TouchableOpacity
                key={item.type}
                style={styles.communityItem}
                activeOpacity={0.7}
                onPress={() => {
                  if (user.user_id == null) { Alert.alert("안내", "로그인이 필요합니다"); }
                  else { navigation.navigate('board2', { board_type: item.type }); }
                }}
              >
                <View style={[styles.communityIconBox, { backgroundColor: item.bg }]}>
                  {item.icon}
                </View>
                <Text style={styles.communityLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {recentPosts.length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.recentTitle}>🔥 인기 게시글</Text>
              {recentPosts.map((post, index) => (
                <TouchableOpacity
                  key={post.board_id}
                  style={[styles.postItem, index < recentPosts.length - 1 && styles.postItemBorder]}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('notice_detail', { board_type: post.board_type_id, board_id: post.board_id })}
                >
                  <View style={[styles.postDot, { backgroundColor: BOARD_TYPE_COLOR[post.board_type_id] }]} />
                  <Text style={styles.postTitle} numberOfLines={1}>{post.title}</Text>
                  <Text style={styles.postNick}>{post.nickname}</Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>

        {/* 그룹 */}
        <CustomCard
          title="그룹"
          onPress={() => {
            if (user.user_id == null) { Alert.alert("안내", "로그인이 필요합니다"); }
            else { navigation.navigate('GroupAdd'); }
          }}
          iscard={0}
        >
          {inputData.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 8, paddingRight: 4 }}
            >
              {inputData.map((group, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.groupCard}
                  activeOpacity={0.75}
                  onPress={() => navigation.navigate('GroupDetail', { group_id: group.group_id, group_maker_id: group.group_maker_id, group_name: group.group_name })}
                >
                  <View style={[styles.groupCardAccent, { backgroundColor: GROUP_COLORS[index % GROUP_COLORS.length] }]} />
                  <View style={styles.groupCardInner}>
                    <View style={[styles.groupAvatar, { backgroundColor: GROUP_COLORS[index % GROUP_COLORS.length] }]}>
                      <Text style={styles.groupAvatarText}>{group.group_name.charAt(0)}</Text>
                    </View>
                    <View style={styles.groupCardBody}>
                      <View style={styles.groupCardNameRow}>
                        <Text style={styles.groupCardName} numberOfLines={1}>{group.group_name}</Text>
                        <View style={[styles.groupBadge, group.is_password === 0 ? styles.badgePublic : styles.badgePrivate]}>
                          <Text style={[styles.groupBadgeText, group.is_password === 0 ? styles.badgePublicText : styles.badgePrivateText]}>
                            {group.is_password === 0 ? '공개' : '비공개'}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.groupCardDesc} numberOfLines={1}>{group.group_description}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.groupAddCard}
                activeOpacity={0.75}
                onPress={() => {
                  if (user.user_id == null) { Alert.alert("안내", "로그인이 필요합니다"); }
                  else { navigation.navigate('GroupAdd'); }
                }}
              >
                <AntDesign name="plus" size={24} color="#aaa" />
                <Text style={styles.groupAddText}>그룹 추가</Text>
              </TouchableOpacity>
            </ScrollView>
          ) : (
            <View style={styles.emptyGroup}>
              <View style={styles.emptyGroupIconWrap}>
                <AntDesign name="team" size={32} color={theme.wiget22} />
              </View>
              <Text style={styles.emptyGroupTitle}>아직 가입한 그룹이 없어요</Text>
              <Text style={styles.emptyGroupSub}>그룹에 참여해 구·신사와 함께 활쏘기를 즐겨보세요</Text>
              <TouchableOpacity
                style={[styles.emptyGroupBtn, { backgroundColor: theme.wiget22 }]}
                activeOpacity={0.7}
                onPress={() => {
                  if (user.user_id == null) { Alert.alert("안내", "로그인이 필요합니다"); }
                  else { navigation.navigate('GroupAdd'); }
                }}
              >
                <Text style={[styles.emptyGroupBtnText, { color: '#fff' }]}>그룹 추가</Text>
              </TouchableOpacity>
            </View>
          )}
        </CustomCard>

        <View style={{ height: 30 }} />
      </ScrollView>
    );
};

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 14,
  },
  communityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  communityItem: {
    flex: 1,
    alignItems: 'center',
  },
  communityIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 7,
  },
  communityLabel: {
    fontSize: 13,
    color: '#444',
    fontWeight: '500',
  },
  emptyGroup: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionMore: {
    fontSize: 13,
    color: '#888',
  },
  postItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    gap: 8,
  },
  postItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  postDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  postTitle: {
    flex: 1,
    fontSize: 14,
    color: '#222',
  },
  postNick: {
    fontSize: 12,
    color: '#aaa',
  },
  // 그룹 카드
  groupCard: {
    width: windowWidth * 0.52,
    backgroundColor: '#fff',
    borderRadius: 14,
    marginRight: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  groupCardAccent: {
    height: 5,
    width: '100%',
  },
  groupCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingVertical: 18,
    gap: 10,
  },
  groupAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  groupCardBody: {
    flex: 1,
  },
  groupCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  groupCardNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  groupCardName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#222',
    flexShrink: 1,
  },
  groupBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgePublic: {
    backgroundColor: '#e8f5e9',
  },
  badgePrivate: {
    backgroundColor: '#fff3e0',
  },
  groupBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  badgePublicText: {
    color: '#43a047',
  },
  badgePrivateText: {
    color: '#ef6c00',
  },
  groupCardDesc: {
    fontSize: 12,
    color: '#888',
    lineHeight: 17,
  },
  groupAddCard: {
    width: windowWidth * 0.28,
    backgroundColor: '#f8f9fc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  groupAddText: {
    fontSize: 12,
    color: '#aaa',
  },
  // 빈 상태
  emptyGroupIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyGroupTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  emptyGroupSub: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  emptyGroupBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyGroupBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 14,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});

const QuickCard = styled.TouchableOpacity`
  width: ${windowWidth * 0.44}px;
  height: 90px;
  background-color: #fff;
  border-radius: 14px;
  margin-right: 12px;
  flex-direction: row;
  align-items: center;
  padding: 0 14px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.08;
  shadow-radius: 6px;
  elevation: 3;
`;

const QuickIconBox = styled.View`
  width: 46px;
  height: 46px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
`;

const QuickTextBox = styled.View`
  flex: 1;
  margin-left: 12px;
`;

const QuickTitle = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: #222;
  margin-bottom: 4px;
`;

const QuickSub = styled.Text`
  font-size: 12px;
  color: #888;
`;

export default HomeMain;
