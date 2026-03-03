import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateGI2 } from 'core';

export default function SurveyForm() {
  const [truth, setTruth] = useState('3');
  const [responsibility, setResponsibility] = useState('3');
  const [restraint, setRestraint] = useState('3');
  const [powerRisk, setPowerRisk] = useState('3');
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<{ score: number; timestamp: string }[]>([]);
  const [session, setSession] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    // load from async storage
    const load = async () => {
      try {
        const s = await AsyncStorage.getItem('session');
        const u = await AsyncStorage.getItem('username');
        if (s && u) {
          setSession(s);
          setUsername(u);
          fetchHistory(s);
        }
      } catch {}
    };
    load();
  }, []);

  const fetchHistory = async (s: string) => {
    const res = await fetch(`http://localhost:3000/api/history?session=${s}`);
    if (res.ok) {
      const data = await res.json();
      setHistory(data.history);
    }
  };

  const handleSubmit = async () => {
    const t = Number(truth);
    const r = Number(responsibility);
    const rs = Number(restraint);
    const p = Number(powerRisk);
    const score = calculateGI2([{ truth: t, responsibility: r, restraint: rs, powerRisk: p }]);
    setResult(score);
    const now = new Date().toISOString();
    if (session) {
      const res = await fetch('http://localhost:3000/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session, entry: { score, timestamp: now } }),
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data.history);
      }
    } else {
      setHistory((prev) => [...prev, { score, timestamp: now }]);
    }
  };

  const handleLogin = async () => {
    if (!username) return;
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    if (res.ok) {
      const data = await res.json();
      setSession(data.session);
      try {
        await AsyncStorage.setItem('session', data.session);
        await AsyncStorage.setItem('username', username);
      } catch {}
      fetchHistory(data.session);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Integrity Survey</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={truth}
        onChangeText={setTruth}
        placeholder="Truth (1-5)"
      />
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={responsibility}
        onChangeText={setResponsibility}
        placeholder="Responsibility (1-5)"
      />
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={restraint}
        onChangeText={setRestraint}
        placeholder="Restraint (1-5)"
      />
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={powerRisk}
        onChangeText={setPowerRisk}
        placeholder="Power Risk (1-5)"
      />
      <Button title="Submit" onPress={handleSubmit} />
      {result !== null && <Text>Result GI²: {result}</Text>}
      <Text>History:</Text>
      {history.map((e, i) => (
        <Text key={i}>{e.timestamp}: {e.score}</Text>
      ))}
      {!session && (
        <View>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Username" />
          <Button title="Login" onPress={handleLogin} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 8 },
});
