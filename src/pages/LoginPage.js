import React, { useState } from 'react';
import { View, Alert, Image, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useAuth } from '../AuthContext';
import { COLORS } from '../theme';

export default function LoginPage({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onLogin = async () => {
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) Alert.alert('Login failed', error.message);
  };

  return (
    <View style={styles.container}>
      {/* ส่วนหัว + โลโก้ */}
      <View style={styles.headerBox}>
        <Image
          source={require('../../image/Logo.png')}
          style={{ width: 100, height: 100, marginBottom: 12 }}
          resizeMode="contain"
        />
        <Text style={styles.title}>Sign In</Text>
      </View>

      {/* ฟอร์มล็อกอิน */}
      <TextInput
        mode="outlined"
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        left={<TextInput.Icon icon="email-outline" />}
      />

      <TextInput
        mode="outlined"
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        style={styles.input}
        left={<TextInput.Icon icon="lock-outline" />}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />

      <Button
        mode="contained"
        loading={loading}
        onPress={onLogin}
        style={styles.button}
        contentStyle={{ paddingVertical: 10 }}
        labelStyle={{ fontWeight: '600' }}
      >
        Login
      </Button>

      {/* ลิงก์ Register / Reset */}
      <View style={styles.linkRow}>
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('Register')}
        >
          Register
        </Text>

        <Text style={{ color: '#000', marginHorizontal: 8 }}>|</Text>

        <Text
          style={[styles.link, { color: COLORS.primary }]}
          onPress={() => navigation.navigate('ResetPassword')}
        >
          Reset Password
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7E3',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
    width: '100%',
  },
  button: {
    borderRadius: 12,
    width: '100%',
    backgroundColor: COLORS.primary,
  },
  linkRow: {
    flexDirection: 'row',
    marginTop: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
});
