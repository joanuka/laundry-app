import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register = async () => {
    if (!email || !password) return;

    const user = { email, password };
    await AsyncStorage.setItem('user', JSON.stringify(user));

    alert('Account created!');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput placeholder="Email" onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} style={styles.input} />

      <TouchableOpacity style={styles.button} onPress={register}>
        <Text style={styles.btnText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 8 },
  button: { backgroundColor: 'green', padding: 15, borderRadius: 8 },
  btnText: { color: '#fff', textAlign: 'center' }
};