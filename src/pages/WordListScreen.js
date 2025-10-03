import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  Alert,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { listWords, deleteWord } from '../services/words';
import { useIsFocused } from '@react-navigation/native';
import { COLORS } from '../theme';

const MAX_W = 420;

export default function WordListScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listWords({ q: q.trim() });
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => { if (isFocused) load(); }, [isFocused, load]);

  useEffect(() => {
    const t = setTimeout(() => { if (isFocused) load(); }, 250);
    return () => clearTimeout(t);
  }, [q, isFocused, load]);

  const onClearSearch = () => setQ('');
  const onAdd = () => navigation.navigate('WordForm');

  const confirmDelete = (item) => {
    Alert.alert('ลบคำนี้?', `ยืนยันการลบ “${item?.hanzi ?? ''}”`, [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'ลบ',
        style: 'destructive',
        onPress: async () => {
          await deleteWord(item.id ?? item._id);
          load();
        },
      },
    ]);
  };

  const renderItem = ({ item }) => {
    const line = [item?.pinyin || null, '–', item?.meaning_th || item?.meaning || '']
      .filter(Boolean)
      .join(' ');

    return (
      <View style={styles.wordItem}>
        <View style={styles.wordHeaderRow}>
          <Text style={styles.hanzi}>{item.hanzi}</Text>
          {!!item?.hsk_level && (
            <View style={styles.hskBadge}>
              <Text style={styles.hskText}>HSK {item.hsk_level}</Text>
            </View>
          )}
        </View>

        <Text style={styles.detail}>{line}</Text>

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('WordForm', { word: item })}
            style={[styles.smallBtn, styles.editBtn]}
            labelStyle={styles.smallBtnText}
            icon="pencil"
          >
            edit
          </Button>
          <Button
            mode="contained"
            onPress={() => confirmDelete(item)}
            style={[styles.smallBtn, styles.deleteBtn]}
            labelStyle={styles.smallBtnText}
            icon="trash-can"
          >
            delete
          </Button>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {Platform.OS === 'android' && <View style={{ height: StatusBar.currentHeight || 0 }} />}

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerSide}>
            <Icon name="arrow-left" size={26} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit</Text>
          <View style={styles.headerSide} />
        </View>

        {/* Search Bar (เล็กลง + กลาง) */}
        <TextInput
          mode="outlined"
          placeholder="search bar"
          value={q}
          onChangeText={setQ}
          returnKeyType="search"
          onSubmitEditing={() => { Keyboard.dismiss(); load(); }}
          style={styles.search}
          right={
            q
              ? <TextInput.Icon icon="close" onPress={onClearSearch} />
              : <TextInput.Icon icon="magnify" onPress={() => { Keyboard.dismiss(); load(); }} />
          }
        />

        {/* Add Button (เล็กลง + กลาง) */}
        <Button
          mode="contained"
          onPress={onAdd}
          style={styles.addBtn}
          contentStyle={{ paddingVertical: 8 }}
          labelStyle={{ fontWeight: 'bold' }}
          icon="plus"
        >
          Add
        </Button>

        {/* Word List */}
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={items}
          keyExtractor={(it, idx) => String(it?.id ?? it?._id ?? idx)}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={COLORS.primary} />}
          ListEmptyComponent={!loading ? <Text style={styles.empty}>ยังไม่มีคำศัพท์</Text> : null}
          keyboardShouldPersistTaps="handled"
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      </View>
    </SafeAreaView>
  );
}

const BG = '#FFF7E3';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingBottom: 16,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 12,
  },
  headerSide: { width: 26 },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },

  /* Search + Add (เล็กลง + อยู่กลาง) */
  search: {
    alignSelf: 'center',
    width: '80%',       // เล็กลงจากเดิม
    maxWidth: 320,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 12,
  },
  addBtn: {
    alignSelf: 'center',
    width: '60%',       // ปุ่มเล็กกว่า search
    maxWidth: 240,
    borderRadius: 20,
    marginBottom: 20,
    backgroundColor: '#E53935',
  },

  /* FlatList: จำกัดกว้าง + อยู่กลาง */
  list: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: MAX_W,
  },
  listContent: {
    paddingBottom: 110,
  },

  /* Word card */
  wordItem: {
    width: '100%',
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  wordHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  hanzi: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000',
  },
  hskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#FFE9A8',
  },
  hskText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A5B00',
  },
  detail: {
    fontSize: 15,
    color: '#444',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  smallBtn: { borderRadius: 20 },
  editBtn: { backgroundColor: COLORS?.primary || '#0a49ff' },
  deleteBtn: { backgroundColor: '#E53935' },
  smallBtnText: { fontSize: 12, color: '#fff' },

  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});
