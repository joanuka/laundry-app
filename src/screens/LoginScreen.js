import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = async () => {
    const data = await AsyncStorage.getItem('user');

    if (!data) {
      setError('No account found. Please sign up.');
      return;
    }

    const user = JSON.parse(data);

    if (user.email === email && user.password === password) {
      navigation.replace('Home');
    } else {
      setError('Incorrect email or password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput placeholder="Email" onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} style={styles.input} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={login}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.link}>No account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 8 },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 8 },
  btnText: { color: '#fff', textAlign: 'center' },
  link: { marginTop: 10, textAlign: 'center', color: 'blue' },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' }
};