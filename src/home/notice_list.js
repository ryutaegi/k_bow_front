import { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import axios from "axios";
import { UserContext } from "../contexts";
import { useIsFocused } from "@react-navigation/native";
import { SpeedDial } from "@rneui/themed";
import getEnvVars from "../../environmant";

const BOARD_COLORS = { 1: '#32B5C6', 2: '#059BF4', 3: '#058549', 4: '#F56412' };

const Notice_list = ({ route, navigation }) => {
  const board_type = route.params.board_type;
  const [inputData, SetInput] = useState([]);
  const { user } = useContext(UserContext);
  const isFocused = useIsFocused();
  const [open, setOpen] = useState(false);
  const { apiUrl } = getEnvVars;
  const pageRef = useRef(1);

  const fetchPosts = async (pageNum) => {
    try {
      const response = await axios.get(
        apiUrl + "/api/board/list/" + board_type + '/' + pageNum,
        { headers: { Authorization: `${user.jwtToken}` } }
      );
      const _inputData = response.data.map((rowData) => ({
        writer: rowData.nickname,
        board_id: rowData.board_id,
        title: rowData.title,
        content: rowData.content,
        date: rowData.created_at_korean,
        like_count: rowData.like_count,
        comment_count: rowData.comment_count,
      }));
      SetInput((prev) => (pageNum === 1 ? _inputData : [...prev, ..._inputData]));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Alert.alert("안내", "로그인이 필요합니다");
        navigation.navigate("홈");
      }
    }
  };

  const loadMorePosts = () => {
    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;
    fetchPosts(nextPage);
  };

  useEffect(() => {
    if (isFocused) {
      pageRef.current = 1;
      fetchPosts(1);
    }
  }, [isFocused]);

  const accentColor = BOARD_COLORS[board_type] || '#059BF4';

  return (
    <>
      <FlatList
        style={styles.container}
        data={inputData}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.item}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("notice_detail", { board_type, board_id: item.board_id })}
          >
            <View style={[styles.accent, { backgroundColor: accentColor }]} />
            <View style={styles.itemBody}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
              </View>
              <Text style={styles.itemContent} numberOfLines={1}>{item.content}</Text>
              <View style={styles.itemFooter}>
                <Text style={styles.itemWriter}>{item.writer}</Text>
                <View style={styles.itemStats}>
                  {item.like_count > 0 && (
                    <Text style={styles.itemStat}>❤️ {item.like_count}</Text>
                  )}
                  {item.comment_count > 0 && (
                    <Text style={styles.itemStat}>💬 {item.comment_count}</Text>
                  )}
                  <Text style={styles.itemDate}>
                    {item.date.slice(0, 10)} {item.date.slice(11, 16)}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.board_id.toString()}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingVertical: 8 }}
      />

      {(board_type !== 1 || user.user_id === 1) && (
        <SpeedDial
          color={accentColor}
          isOpen={open}
          icon={{ name: 'edit', color: '#fff' }}
          openIcon={{ name: 'close', color: '#fff' }}
          onOpen={() => navigation.navigate("create_post", { board_type })}
          onClose={() => setOpen(false)}
        >
          <SpeedDial.Action
            color={accentColor}
            icon={{ name: 'add', color: '#fff' }}
            title="글쓰기"
            onPress={() => navigation.navigate("create_post", { board_type })}
          />
        </SpeedDial>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 14,
    marginVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  accent: {
    width: 4,
  },
  itemBody: {
    flex: 1,
    padding: 14,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 8,
  },
  itemContent: {
    fontSize: 13,
    color: '#888',
    marginBottom: 10,
    lineHeight: 18,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemWriter: {
    fontSize: 12,
    color: '#aaa',
    fontWeight: '500',
  },
  itemStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemStat: {
    fontSize: 12,
    color: '#aaa',
  },
  itemDate: {
    fontSize: 12,
    color: '#bbb',
  },
  separator: {
    height: 0,
  },
});

export default Notice_list;
