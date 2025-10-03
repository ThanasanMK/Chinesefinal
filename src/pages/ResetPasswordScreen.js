import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { COLORS } from '../theme';
// import { resetPassword } from '../services/auth'; // ถ้ามี API

export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const onReset = async () => {
    if (!email.trim()) {
      return Alert.alert('ผิดพลาด', 'กรุณากรอกอีเมล');
    }

    try {
      // TODO: เรียก API resetPassword(email)
      // await resetPassword(email);
      Alert.alert('สำเร็จ', 'เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว');
      navigation.goBack();
    } catch (e) {
      Alert.alert('ล้มเหลว', e.message || 'ไม่สามารถรีเซ็ตรหัสผ่านได้');
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>รีเซ็ตรหัสผ่าน</Text>
          <Text style={styles.subtitle}>กรอกอีเมลของคุณเพื่อรับลิงก์รีเซ็ต</Text>

          <TextInput
            label="อีเมล"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Button
            mode="contained"
            onPress={onReset}
            style={styles.resetBtn}
            contentStyle={{ paddingVertical: 8 }}
            labelStyle={styles.buttonText}
          >
            ส่งลิงก์รีเซ็ต
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            กลับไปหน้าเข้าสู่ระบบ
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const BG = '#FFF7E3';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    borderRadius: 18,
    padding: 20,
    backgroundColor: COLORS?.surface || '#fff',
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  resetBtn: {
    borderRadius: 20,
    backgroundColor: '#E53935',
    marginBottom: 8,
  },
  backBtn: {
    marginTop: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
