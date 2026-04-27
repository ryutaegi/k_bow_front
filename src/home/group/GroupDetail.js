import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "styled-components/native";
import getEnvVars from "../../../environmant";
import { UserContext } from "../../contexts";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { Alert } from "react-native";
import { SpeedDial } from "@rneui/themed";
import { ScrollView } from "react-native-gesture-handler";

const { width } = Dimensions.get('window');

const MEDAL_COLORS = ['#F5C518', '#A8A9AD', '#CD7F32'];
const MEDAL_LABELS = ['1위', '2위', '3위'];
const MEMBER_COLORS = ['#5B8DEF', '#F4845F', '#4CAF82', '#9B72CF', '#E8A838', '#3BBFBF'];

const GroupDetail = ({ route, navigation }) => {
  const groupDetail_id = route.params.group_id;
  const group_maker_id = route.params.group_maker_id;
  const theme = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const { apiUrl } = getEnvVars;
  const [memberlist, SetMemberlist] = useState([]);
  const [userList, setUserList] = useState([]);
  const [countList, setCountList] = useState([]);
  const [open, setOpen] = useState(false);

  const withdraw = () => {
    axios({ method: "post", url: `${apiUrl}/api/group/withdraw`,
      headers: { Authorization: `${user.jwtToken}` },
      data: { group_id: groupDetail_id },
    }).then(() => navigation.navigate("홈"))
      .catch((e) => {
        if (e.response) {
          switch (e.response.status) {
            case 401: Alert.alert("안내", "비밀번호가 틀립니다."); break;
            case 403: Alert.alert("안내", "권한이 없습니다."); break;
            case 500: Alert.alert("안내", "서버 에러가 발생했습니다."); break;
            default: Alert.alert("안내", "알 수 없는 에러가 발생했습니다.");
          }
        } else {
          Alert.alert("안내", "서버로부터 응답이 없습니다.");
        }
      });
  };

  const groupdelete = () => {
    axios({ method: "post", url: `${apiUrl}/api/group/delete`,
      headers: { Authorization: `${user.jwtToken}` },
      data: { group_id: groupDetail_id },
    }).then(() => navigation.navigate("홈"))
      .catch((e) => {
        if (e.response) {
          switch (e.response.status) {
            case 401: Alert.alert("안내", "비밀번호가 틀립니다."); break;
            case 403: Alert.alert("안내", "권한이 없습니다."); break;
            case 500: Alert.alert("안내", "서버 에러가 발생했습니다."); break;
            default: Alert.alert("안내", "알 수 없는 에러가 발생했습니다.");
          }
        } else {
          Alert.alert("안내", "서버로부터 응답이 없습니다.");
        }
      });
  };

  useEffect(() => {
    const gets = async () => {
      try {
        const response = await axios.get(apiUrl + "/api/group/rank/" + groupDetail_id, {
          headers: { Authorization: `${user.jwtToken}` },
        });
        setUserList(response.data.sortedRatioResults.map((r) => ({
          user_id: r.user_id,
          nickname: r.nickname,
          average: r.ratio * 5,
        })));
        setCountList(response.data.sortedElementCountResults.map((r) => ({
          user_id: r.user_id,
          nickname: r.nickname,
          shot_day: parseInt(r.elementCount),
        })));
      } catch (e) { console.log("에러가 발생했습니다.", e); }
    };
    gets();
  }, []);

  useEffect(() => {
    axios({ method: "post", url: `${apiUrl}/api/group/list/memberdetail`,
      headers: { Authorization: `${user.jwtToken}` },
      data: { group_id: groupDetail_id },
    }).then((response) => {
      SetMemberlist(response.data.map((r) => ({
        user_id: r.user_id,
        image_URL: r.image_url,
        user_name: r.nickname,
      })));
    }).catch((e) => {
      if (e.response) Alert.alert("안내", "멤버 정보를 불러오지 못했습니다.");
    });
  }, []);

  const RankSection = ({ title, data, renderScore }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {data.slice(0, 3).map((item, index) => (
        <View key={item.user_id} style={styles.rankRow}>
          <View style={[styles.medalBadge, { backgroundColor: MEDAL_COLORS[index] + '22' }]}>
            <Text style={[styles.medalText, { color: MEDAL_COLORS[index] }]}>
              {MEDAL_LABELS[index]}
            </Text>
          </View>
          <AntDesign
            name="Trophy"
            size={16}
            color={MEDAL_COLORS[index]}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.rankName}>{item.nickname}</Text>
          <Text style={styles.rankScore}>{renderScore(item)}</Text>
        </View>
      ))}
      {data.length === 0 && (
        <Text style={styles.emptyText}>아직 기록이 없어요</Text>
      )}
    </View>
  );

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>

        <TouchableOpacity
          style={styles.boardBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('GroupBoard', { group_id: groupDetail_id, group_name: route.params.group_name })}
        >
          <Text style={styles.boardBtnText}>📋 그룹 게시판</Text>
          <Text style={styles.boardBtnArrow}>→</Text>
        </TouchableOpacity>

        <RankSection
          title="시수 순위"
          data={userList}
          renderScore={(item) => `평 ${item.average.toFixed(1)}중`}
        />

        <RankSection
          title="습사 순위"
          data={countList}
          renderScore={(item) => `${item.shot_day}일`}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>그룹원 {memberlist.length > 0 ? `· ${memberlist.length}명` : ''}</Text>
          <View style={styles.memberGrid}>
            {memberlist.map((member, index) => (
              <View key={member.user_id} style={styles.memberItem}>
                {member.image_URL ? (
                  <Image source={{ uri: member.image_URL }} style={styles.memberAvatar} />
                ) : (
                  <View style={[styles.memberAvatar, styles.memberAvatarFallback, { backgroundColor: MEMBER_COLORS[index % MEMBER_COLORS.length] }]}>
                    <Text style={styles.memberInitial}>{member.user_name.charAt(0)}</Text>
                  </View>
                )}
                <Text style={styles.memberName} numberOfLines={1}>{member.user_name}</Text>
                {member.user_id === group_maker_id && (
                  <View style={styles.leaderBadge}>
                    <Text style={styles.leaderBadgeText}>방장</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

      </ScrollView>

      <SpeedDial
        color={theme.wiget22}
        isOpen={open}
        icon={{ name: "menu", color: "#fff" }}
        openIcon={{ name: "close", color: "#fff" }}
        onOpen={() => setOpen(!open)}
        onClose={() => setOpen(!open)}
      >
        {group_maker_id === user.user_id ? (
          <SpeedDial.Action
            color="#e53935"
            icon={{ name: "delete", color: "#fff" }}
            title="그룹 삭제하기"
            onPress={() => Alert.alert("그룹 삭제", "그룹을 삭제하시겠습니까?", [
              { text: "취소", style: "cancel" },
              { text: "삭제", style: "destructive", onPress: groupdelete },
            ])}
          />
        ) : (
          <SpeedDial.Action
            color={theme.wiget22}
            icon={{ name: "exit-to-app", color: "#fff" }}
            title="그룹 탈퇴하기"
            onPress={() => Alert.alert("그룹 탈퇴", "그룹에서 탈퇴하시겠습니까?", [
              { text: "취소", style: "cancel" },
              { text: "탈퇴", style: "destructive", onPress: withdraw },
            ])}
          />
        )}
      </SpeedDial>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 14,
    marginTop: 14,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 14,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  medalBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 10,
  },
  medalText: {
    fontSize: 11,
    fontWeight: '700',
  },
  rankName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },
  rankScore: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 13,
    color: '#bbb',
    textAlign: 'center',
    paddingVertical: 16,
  },
  memberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  memberItem: {
    width: (width - 28 - 32 - 32) / 4,
    alignItems: 'center',
  },
  memberAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 6,
  },
  memberAvatarFallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInitial: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  memberName: {
    fontSize: 12,
    color: '#444',
    fontWeight: '500',
    textAlign: 'center',
  },
  leaderBadge: {
    marginTop: 3,
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  leaderBadgeText: {
    fontSize: 10,
    color: '#E65100',
    fontWeight: '600',
  },
  boardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginHorizontal: 14,
    marginTop: 14,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  boardBtnText: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  boardBtnArrow: { fontSize: 16, color: '#aaa' },
});

export default GroupDetail;
