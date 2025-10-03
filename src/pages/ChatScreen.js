import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  TextInput as RNTextInput,
  TouchableOpacity
} from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const BG = '#FFF7E3';
const HEADER = '#F9F1DD';
const TAB_YELLOW = '#FFD24D';

export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([
    { id: 'm1', text: 'สวัสดี! ฉันคือ Chinese Buddy 👋', sender: 'bot', time: '10:00' },
    { id: 'm2', text: 'พิมพ์คำศัพท์จีนที่อยากฝึกมาได้เลยนะ', sender: 'bot', time: '10:00' },
  ]);
  const [text, setText] = useState('');
  const listRef = useRef(null);

  const sendMessage = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg = {
      id: `u-${Date.now()}`,
      text: trimmed,
      sender: 'me',
      time: new Date().toLocaleTimeString().slice(0,5)
    };
    setMessages(prev => [...prev, userMsg]);
    setText('');

    // bot ตอบกลับแบบง่าย ๆ
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          text: `รับทราบ: “${trimmed}” (ฟีเจอร์แปล/ออกเสียงกำลังพัฒนา)`,
          sender: 'bot',
          time: new Date().toLocaleTimeString().slice(0,5)
        }
      ]);
    }, 450);
  };

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages.length]);

  const renderItem = ({ item }) => {
    const isMe = item.sender === 'me';
    return (
      <View style={[styles.row, isMe ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]}>
        {!isMe && (
          <View style={styles.avatarBot}>
            <Icon name="robot-happy-outline" size={18} color="#0b6b79" />
          </View>
        )}
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleBot]}>
          <Text style={[styles.msgText, isMe ? { color: '#fff' } : { color: '#062a2d' }]}>{item.text}</Text>
          <Text style={[styles.time, isMe ? { color: '#e8f0ff' } : { color: '#5d6e71' }]}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-left" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Chat</Text>
        <View style={{ width: 26 }} />{/* spacer */}
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 90 }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Input bar */}
        <View style={styles.inputBar}>
          <RNTextInput
            style={styles.textInput}
            placeholder="พิมพ์ข้อความ..."
            value={text}
            onChangeText={setText}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Icon name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  header: {
    backgroundColor: HEADER,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backBtn: {
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center'
  },
  title: { fontSize: 20, fontWeight: '800', color: '#000', marginLeft: 6 },

  row: { flexDirection: 'row', alignItems: 'flex-end', marginVertical: 6, gap: 8 },
  avatarBot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#D9F6FB', alignItems: 'center', justifyContent: 'center'
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  bubbleMe: { backgroundColor: '#0a49ff', borderBottomRightRadius: 6 },
  bubbleBot: { backgroundColor: '#ffffff', borderBottomLeftRadius: 6, borderWidth: 1, borderColor: '#E6ECEF' },
  msgText: { fontSize: 15 },
  time: { fontSize: 11, marginTop: 4 },

  inputBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 14,
    backgroundColor: '#fff',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    // shadow
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 8, elevation: 3,
  },
  textInput: { flex: 1, height: 44, paddingHorizontal: 8, fontSize: 15 },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#0a49ff',
    alignItems: 'center', justifyContent: 'center', marginLeft: 6, marginVertical: 4,
  },
});
