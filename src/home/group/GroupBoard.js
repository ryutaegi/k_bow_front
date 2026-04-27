import { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { UserContext } from '../../contexts';
import { useIsFocused } from '@react-navigation/native';
import getEnvVars from '../../../environmant';

const ACCENT = '#5B8DEF';

const GroupBoard = ({ route, navigation }) => {
  const { group_id, group_name } = route.params;
  const { user } = useContext(UserContext);
  const { apiUrl } = getEnvVars;
  const [posts, setPosts] = useState([]);
  const pageRef = useRef(1);
  const isFocused = useIsFocused();

  const fetchPosts = async (pageNum) => {
    try {
      const res = await axios.get(`${apiUrl}/api/group/board/${group_id}/${pageNum}`, {
        headers: { Authorization: `${user.jwtToken}` },
      });
      setPosts(prev => pageNum === 1 ? res.data : [...prev, ...res.data]);
    } catch (e) { console.log(e); }
  };

  const loadMore = () => {
    const next = pageRef.current + 1;
    pageRef.current = next;
    fetchPosts(next);
  };

  useEffect(() => {
    if (isFocused) {
      pageRef.current = 1;
      fetchPosts(1);
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={item => item.post_id.toString()}
        contentContainerStyle={{ paddingVertical: 8 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>아직 게시글이 없어요</Text>
            <Text style={styles.emptySub}>첫 글을 남겨보세요!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('GroupBoardDetail', { post: item, group_id, group_name })}
          >
            <View style={[styles.accent, { backgroundColor: ACCENT }]} />
            <View style={styles.itemBody}>
              <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.itemContent} numberOfLines={1}>{item.content}</Text>
              <View style={styles.itemFooter}>
                <Text style={styles.itemWriter}>{item.nickname}</Text>
                <View style={styles.itemMeta}>
                  {item.like_count > 0 && (
                    <Text style={styles.metaText}>❤️ {item.like_count}</Text>
                  )}
                  {item.comment_count > 0 && (
                    <Text style={styles.metaText}>💬 {item.comment_count}</Text>
                  )}
                  <Text style={styles.itemDate}>
                    {item.created_at_korean ? item.created_at_korean.slice(0, 10) : ''}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: ACCENT }]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('GroupBoardCreate', { group_id, group_name })}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 14,
    marginVertical: 2,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  accent: { width: 4 },
  itemBody: { flex: 1, padding: 14 },
  itemTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  itemContent: { fontSize: 13, color: '#888', marginBottom: 8 },
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemWriter: { fontSize: 12, color: '#aaa', fontWeight: '500' },
  itemMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { fontSize: 12, color: '#aaa' },
  itemDate: { fontSize: 12, color: '#bbb' },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#aaa', marginBottom: 6 },
  emptySub: { fontSize: 13, color: '#ccc' },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: { color: '#fff', fontSize: 26, lineHeight: 30 },
});

export default GroupBoard;
