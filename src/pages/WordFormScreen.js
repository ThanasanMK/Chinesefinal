import React, { useState } from 'react';
import {View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView,} from 'react-native';
import { TextInput,  Button,Text,Card,Chip, Divider,} from 'react-native-paper';
import { COLORS } from '../theme';
import { createWord, updateWord } from '../services/words';

export default function WordFormScreen({ navigation, route }) {
  const editing = route?.params?.word;
  const [hanzi, setHanzi] = useState(editing?.hanzi || '');
  const [pinyin, setPinyin] = useState(editing?.pinyin || '');
  const [meaning, setMeaning] = useState(editing?.meaning_th || '');
  const [hsk, setHsk] = useState(editing?.hsk_level?.toString() || '');

  const onSave = async () => {
    if (!hanzi.trim() || !meaning.trim()) {
      return Alert.alert('ผิดพลาด', 'กรุณากรอก 汉字 และ ความหมาย');
    }

    try {
      const payload = {
        hanzi: hanzi.trim(),
        pinyin: pinyin.trim(),
        meaning_th: meaning.trim(),
        hsk_level: hsk ? Number(hsk) : null,
      };

      if (editing) {
        await updateWord(editing.id, payload);
      } else {
        await createWord(payload);
      }

      Alert.alert('สำเร็จ', editing ? 'แก้ไขคำศัพท์แล้ว' : 'เพิ่มคำศัพท์แล้ว');
      navigation.goBack();
    } catch (e) {
      Alert.alert('บันทึกไม่ได้', e.message);
    }
  };

  const onCancel = () => navigation.goBack();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>
              {editing ? 'Edit Vocabulary' : 'Add Vocabulary'}
            </Text>
            <Text style={styles.subtitle}>
              เพิ่ม/แก้ไขคำศัพท์ภาษาจีน
            </Text>

            <View style={styles.section}>
              <TextInput
                label="汉字 (Hanzi)"
                value={hanzi}
                onChangeText={setHanzi}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="format-letter-matches" />}
              />

              <TextInput
                label="Pinyin"
                value={pinyin}
                onChangeText={setPinyin}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="alphabet-latin" />}
              />

              <TextInput
                label="ความหมาย (ไทย)"
                value={meaning}
                onChangeText={setMeaning}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="translate" />}
                multiline
              />
            </View>

            <Divider style={styles.divider} />

            {/* HSK Level ชุดชิปให้เลือก */}
            <View style={styles.section}>
              <Text style={styles.label}>HSK Level</Text>
              <View style={styles.chipsWrap}>
                {['1','2','3','4','5','6'].map(lv => (
                  <Chip
                    key={lv}
                    selected={hsk === lv}
                    onPress={() => setHsk(lv)}
                    style={styles.chip}
                    mode="outlined"
                  >
                    HSK {lv}
                  </Chip>
                ))}
                <Chip
                  selected={!hsk}
                  onPress={() => setHsk('')}
                  style={styles.chip}
                  mode="outlined"
                >
                  ไม่มี
                </Chip>
              </View>
            </View>

            <View style={styles.actions}>
              <Button
                mode="contained"
                onPress={onSave}
                style={styles.saveButton}
                contentStyle={{ paddingVertical: 10 }}
                labelStyle={styles.buttonText}
              >
                Save
              </Button>

              <Button
                mode="contained-tonal"
                onPress={onCancel}
                style={styles.cancelButton}
                contentStyle={{ paddingVertical: 10 }}
                labelStyle={[styles.buttonText, { color: '#000' }]}
              >
                Cancel
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const BG = '#FFF7E3';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  scroll: {
    flexGrow: 1, // ให้ ScrollView ขยายเต็ม
    justifyContent: 'center', // จัดกลางแนวตั้ง
    alignItems: 'center',     // จัดกลางแนวนอน
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 420, // จำกัดความกว้างกลางจอ
    borderRadius: 18,
    paddingVertical: 4,
    backgroundColor: COLORS?.surface || '#fff',
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    color: '#111',
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    color: '#666',
    marginTop: 6,
    marginBottom: 14,
  },
  divider: {
    marginVertical: 12,
    opacity: 0.4,
  },
  section: {
    marginTop: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: 16,
  },
  actions: {
    marginTop: 12,
    gap: 10,
  },
  saveButton: {
    borderRadius: 14,
    backgroundColor: '#E53935',
  },
  cancelButton: {
    borderRadius: 14,
    backgroundColor: '#E6E6E6',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
