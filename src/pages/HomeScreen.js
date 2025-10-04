import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar,
  ActivityIndicator, FlatList, ImageBackground
} from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useAuth } from '../AuthContext';
import { listWords } from '../services/words';
import { useIsFocused } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const { signOut, user } = useAuth();
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  const loadWords = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listWords({});
      setWords(Array.isArray(data) ? [...data].reverse() : []);
    } catch (e) {
      console.log('Load words error:', e?.message);
      setWords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (isFocused) loadWords(); }, [isFocused, loadWords]);

  const renderItem = useMemo(
    () => ({ item }) => (
      <View style={styles.pill}>
        <Text style={styles.pillText}>
          {[
            item?.hanzi,
            item?.pinyin ? `(${item.pinyin})` : null,
            '–',
            item?.meaning_th || item?.meaning
          ].filter(Boolean).join(' ')}
        </Text>
      </View>
    ),
    []
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ImageBackground
        // 🔁 เปลี่ยนเป็นรูปของคุณเองในโฟลเดอร์ image/
        source={require('../../image/backgrod.png')}
        style={styles.bg}
        resizeMode="cover"
      >
        {/* overlay โปร่งใส อยู่ใต้คอนเทนต์ และไม่กันการกด */}
        <View pointerEvents="none" style={styles.overlay} />

        <View style={styles.container}>
          {/* ===== Header ===== */}
          <View style={styles.header}>
            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={styles.iconBell}
                onPress={() => navigation.navigate('Notifications')}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="bell-ring-outline" size={22} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconLogout}
                onPress={signOut}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="logout" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.h1}>Home</Text>
            <Text style={styles.sub}>ยินดีต้อนรับคุณ</Text>
            <Text style={styles.email}>{String(user?.username ?? user?.email ?? '')}</Text>
          </View>

          {/* ===== Vocabulary Card (ทั้งหมด) ===== */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Vocabulary</Text>

            {loading ? (
              <View style={{ alignItems: 'center', marginVertical: 20 }}>
                <ActivityIndicator />
              </View>
            ) : words.length > 0 ? (
              <FlatList
                data={words}
                keyExtractor={(item, idx) => String(item?.id ?? item?._id ?? idx)}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                contentContainerStyle={{ paddingVertical: 8 }}
                showsVerticalScrollIndicator={false}
                refreshing={loading}
                onRefresh={loadWords}
                style={{ maxHeight: 280 }}
              />
            ) : (
              <Text style={{ textAlign: 'center', color: '#555', marginTop: 8 }}>
                ยังไม่มีคำศัพท์ • เพิ่มได้ที่ปุ่ม Edit ด้านล่าง
              </Text>
            )}
          </View>

          {/* ===== Bottom Tab ===== */}
          <View style={styles.tab}>
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="home-variant" size={26} color="#9a5200" />
              <Text style={styles.tabLabel}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => navigation.navigate('Chat')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="chat-processing" size={26} color="#0b6b79" />
              <Text style={styles.tabLabel}>Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => navigation.navigate('Words')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="plus-circle" size={26} color="#0a49ff" />
              <Text style={styles.tabLabel}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const TAB_YELLOW = '#FFD24D';

const styles = StyleSheet.create({
  safe: { flex: 1 },
  bg: { flex: 1, width: '100%', height: '100%' },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },

  container: { flex: 1 },

  header: {
    backgroundColor: 'rgba(255,255,255,0.86)',
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginBottom: 12,
  },
  iconBell: {
    backgroundColor: '#FFE9A8',
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  iconLogout: {
    backgroundColor: '#FF5A4E',
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  h1: { fontSize: 34, lineHeight: 40, fontWeight: '800', color: '#000' },
  sub: { fontSize: 16, color: '#333', marginTop: 8 },
  email: { fontSize: 16, color: '#333' },

  card: {
    backgroundColor: '#fff',
    marginTop: 24,
    marginHorizontal: 20,
    borderRadius: 26,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: { textAlign: 'center', fontSize: 20, fontWeight: '800', marginBottom: 14 },
  pill: {
    borderWidth: 1.2,
    borderColor: '#000',
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  pillText: { textAlign: 'center', fontSize: 15, color: '#000' },

  tab: {
    position: 'absolute',
    left: 16, right: 16, bottom: 14,
    height: 78,
    backgroundColor: TAB_YELLOW,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  tabItem: { alignItems: 'center', justifyContent: 'center', gap: 4 },
  tabLabel: { fontSize: 12, color: '#000', fontWeight: '700' },
});
