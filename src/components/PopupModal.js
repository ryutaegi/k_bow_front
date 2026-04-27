import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
  StyleSheet,
  BackHandler,
} from 'react-native';

const APP_STORE_URL = 'https://apps.apple.com/app/id6467799734';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.taeyou.reactexam';

const PopupModal = ({ visible, popup, onClose, onDismissToday }) => {
  const isForceUpdate = popup?.type === 'force_update';

  // 강제 업데이트일 때 Android 뒤로가기 차단
  React.useEffect(() => {
    if (!isForceUpdate || !visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, [isForceUpdate, visible]);

  const handleUpdate = () => {
    const url = Platform.OS === 'ios' ? APP_STORE_URL : PLAY_STORE_URL;
    Linking.openURL(url);
  };

  if (!popup) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={isForceUpdate ? undefined : onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{popup.title}</Text>
          {!!popup.content && (
            <Text style={styles.content}>{popup.content}</Text>
          )}

          {isForceUpdate ? (
            // 강제 업데이트: 업데이트 버튼만
            <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
              <Text style={styles.updateBtnText}>업데이트</Text>
            </TouchableOpacity>
          ) : (
            // 일반 공지: 오늘 하루 보지 않기 + 닫기
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.dismissBtn} onPress={onDismissToday}>
                <Text style={styles.dismissBtnText}>오늘 하루 보지 않기</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Text style={styles.closeBtnText}>닫기</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 12,
    lineBreakStrategyIOS: 'hangul-word',
  },
  content: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
    marginBottom: 24,
    lineBreakStrategyIOS: 'hangul-word',
  },
  updateBtn: {
    backgroundColor: '#e8342a',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  updateBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dismissBtn: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  dismissBtnText: {
    color: '#666',
    fontSize: 13,
    lineBreakStrategyIOS: 'hangul-word',
  },
  closeBtn: {
    flex: 1,
    backgroundColor: '#4a4a4a',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default PopupModal;
