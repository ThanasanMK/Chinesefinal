// src/pages/NotificationsScreen.js
import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Alert, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { listNotifications, markRead, removeNotification } from '../services/notifications';

const BG = '#FFF7E3';
const HEADER = '#F9F1DD';

export default function NotificationsScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listNotifications();
      setItems([...data].sort((a, b) => (b.ts || 0) - (a.ts || 0)));
    } catch (e) {
      Alert.alert('Error', e.message || 'โหลดการแจ้งเตือนล้มเหลว');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onMarkRead = async (id) => {
    try {
      await markRead(id);
      setItems(prev => prev.map(it => it.id === id ? { ...it, read: true } : it));
    } catch (e) {
      Alert.alert('Error', e.message || 'ทำเครื่องหมายอ่านไม่ได้');
    }
  };

  const onDelete = (id) => {
    Alert.alert('ลบการแจ้งเตือน', 'ต้องการลบรายการนี้หรือไม่?', [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'ลบ',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeNotification(id);
            setItems(prev => prev.filter(it => it.id !== id));
          } catch (e) {
            Alert.alert('Error', e.message || 'ลบไม่ได้');
          }
        }
      },
    ]);
  };

  const timeAgo = (ts) => {
    if (!ts) return '';
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'เมื่อสักครู่';
    if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`;
    return `${Math.floor(diff / 86400)} วันที่แล้ว`;
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <View style={styles.row}>
          <View style={styles.titleWrap}>
            {!item.read && <View style={styles.unreadDot} />}
            <Text style={styles.title}>{item.title}</Text>
          </View>
          <Text style={styles.time}>{timeAgo(item.ts)}</Text>
        </View>

        {!!item.body && <Text style={styles.body}>{item.body}</Text>}

        <View style={styles.actions}>
          {!item.read && (
            <Button mode="contained-tonal" onPress={() => onMarkRead(item.id)} icon="check" style={styles.actionBtn}>
              อ่านแล้ว
            </Button>
          )}
          <Button mode="contained-tonal" onPress={() => onDelete(item.id)} icon="delete-outline" style={styles.actionBtn}>
            ลบ
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* กัน status bar ชนบนสำหรับ Android */}
      {Platform.OS === 'android' && <View style={{ height: StatusBar.currentHeight || 0 }} />}

      {/* Header มี margin ซ้าย-ขวา */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerSide}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerSide} />
      </View>

      {/* รายการมี padding แนวนอน ไม่ชิดขอบจอ */}
      <FlatList
        data={items}
        keyExtractor={(it, idx) => String(it?.id ?? idx)}
        renderItem={renderItem}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor="#0a49ff" />}
        ListEmptyComponent={!loading ? <Text style={styles.empty}>ยังไม่มีการแจ้งเตือน</Text> : null}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </SafeAreaView>
  );
}

const H_PAD = 16; // ระยะห่างซ้าย/ขวา

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  header: {
    backgroundColor: HEADER,
    marginHorizontal: H_PAD,      // ← ไม่ชิดขอบซ้าย/ขวา
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,             // กลมทุกมุม
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSide: { width: 26 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '800', color: '#000' },

  list: {
    flex: 1,
    paddingHorizontal: H_PAD,     // ← ระยะห่างซ้าย/ขวาทั้งลิสต์
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 24,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 2,
  },

  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titleWrap: { flexDirection: 'row', alignItems: 'center', flexShrink: 1, paddingRight: 8 },
  title: { fontSize: 16, fontWeight: '800', color: '#111', flexShrink: 1 },
  time: { fontSize: 12, color: '#666' },
  body: { marginTop: 6, color: '#333' },

  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  actionBtn: { borderRadius: 14 },

  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF5A4E', marginRight: 6 },

  empty: { textAlign: 'center', marginTop: 24, color: '#666' },
});
