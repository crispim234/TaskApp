import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { supabase } from '../config/supabase';

export default function LoginScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Preencha e-mail e senha para continuar.');
      return;
    }
    if (!isLogin && !name.trim()) {
      Alert.alert('Atenção', 'Informe seu nome para criar a conta.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { name: name.trim() } },
        });
        if (error) throw error;
        Alert.alert('Conta criada!', 'Verifique seu e-mail para confirmar a conta antes de entrar.');
        setIsLogin(true);
        setLoading(false);
        return;
      }
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Erro', error.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        <View style={styles.logoArea}>
          <View style={styles.iconWrapper}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.appName}>TaskApp</Text>
          <Text style={styles.subtitle}>Organize. Foque. Conquiste.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{isLogin ? 'Bem-vindo de volta' : 'Criar conta'}</Text>
          <Text style={styles.cardSub}>{isLogin ? 'Entre com suas credenciais' : 'Preencha os dados abaixo'}</Text>

          {!isLogin && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Seu nome"
                placeholderTextColor="#4A4E65"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor="#4A4E65"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="••••••••"
                placeholderTextColor="#4A4E65"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitDisabled]}
            onPress={handleSubmit}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#FFF" />
              : <Text style={styles.submitText}>{isLogin ? 'Entrar' : 'Criar Conta'}</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.toggleButton}>
            <Text style={styles.toggleText}>
              {isLogin ? 'Não tem conta? ' : 'Já tem conta? '}
              <Text style={styles.toggleLink}>{isLogin ? 'Cadastre-se' : 'Faça login'}</Text>
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#0F1117' },
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  logoArea: { alignItems: 'center', marginBottom: 36 },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(124, 92, 252, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(124, 92, 252, 0.3)',
  },
  logo: { width: 46, height: 46 },
  appName: { fontSize: 30, fontWeight: '800', color: '#F4F4F5' },
  subtitle: { fontSize: 14, color: '#8B8FA8', marginTop: 6 },
  card: {
    backgroundColor: '#1A1D24',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#2A2D3A',
  },
  cardTitle: { fontSize: 22, fontWeight: '700', color: '#F4F4F5', marginBottom: 4 },
  cardSub: { fontSize: 13, color: '#8B8FA8', marginBottom: 24 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#8B8FA8', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#2A2D3A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#F4F4F5',
    backgroundColor: '#222630',
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  passwordInput: { flex: 1 },
  eyeButton: { position: 'absolute', right: 14 },
  eyeText: { fontSize: 18 },
  submitButton: {
    backgroundColor: '#7C5CFC',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 18,
  },
  submitDisabled: { opacity: 0.5 },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  toggleButton: { alignItems: 'center' },
  toggleText: { fontSize: 14, color: '#8B8FA8' },
  toggleLink: { color: '#7C5CFC', fontWeight: '700' },
});
