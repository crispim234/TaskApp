import React from 'react';
import {
  View, Text, TouchableOpacity, Switch, ScrollView,
  StyleSheet, Image, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTasks } from '../context/TaskContext';
import { supabase } from '../config/supabase';
import type { SettingsScreenProps } from '../types';

const VERSION = '1.0.0';

interface SettingRowProps {
  icon: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  danger?: boolean;
}

function SettingRow({ icon, title, subtitle, right, onPress, danger }: SettingRowProps) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={[styles.rowIcon, danger && styles.rowIconDanger]}>
        <Text style={styles.rowIconText}>{icon}</Text>
      </View>
      <View style={styles.rowContent}>
        <Text style={[styles.rowTitle, danger && styles.rowTitleDanger]}>{title}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      {right && <View style={styles.rowRight}>{right}</View>}
    </TouchableOpacity>
  );
}

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { user, setUser, settings, updateSettings, tasks } = useTasks();

  const pending = tasks.filter(t => t.status === 'pendente').length;
  const done = tasks.filter(t => t.status === 'concluído').length;
  const progressPercent = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;

  function handleLogout() {
    Alert.alert('Sair', 'Deseja realmente sair da conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair', style: 'destructive', onPress: async () => {
          await supabase.auth.signOut();
          setUser(null);
          navigation.replace('Login');
        },
      },
    ]);
  }

  function handleClearData() {
    Alert.alert(
      'Limpar dados',
      'Isso excluirá todas as tarefas permanentemente. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar', style: 'destructive', onPress: async () => {
            await AsyncStorage.removeItem('@tasks');
            Alert.alert('Pronto', 'Dados limpos. Reinicie o app para ver as mudanças.');
          },
        },
      ]
    );
  }

  const userName = user?.user_metadata?.name ?? 'Usuário';
  const userEmail = user?.email ?? 'sem e-mail';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.profileCard}>
        <Image source={require('../../assets/avatar.png')} style={styles.profileAvatar} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{userName}</Text>
          <Text style={styles.profileEmail}>{userEmail}</Text>
        </View>
        <View style={styles.profileBadge}>
          <View style={styles.profileBadgeDot} />
          <Text style={styles.profileBadgeText}>Ativo</Text>
        </View>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progresso geral</Text>
          <Text style={styles.progressPercent}>{progressPercent}%</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={styles.progressSub}>{done} de {tasks.length} tarefas concluídas</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{tasks.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statCard, { borderColor: 'rgba(124,92,252,0.3)' }]}>
          <Text style={[styles.statNumber, { color: '#7C5CFC' }]}>{pending}</Text>
          <Text style={styles.statLabel}>Pendentes</Text>
        </View>
        <View style={[styles.statCard, { borderColor: 'rgba(34,197,94,0.3)' }]}>
          <Text style={[styles.statNumber, { color: '#22C55E' }]}>{done}</Text>
          <Text style={styles.statLabel}>Concluídas</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Preferências</Text>
      <View style={styles.section}>
        <SettingRow
          icon="🔔"
          title="Notificações"
          subtitle="Lembretes de tarefas pendentes"
          right={
            <Switch
              value={settings.notifications}
              onValueChange={v => updateSettings({ notifications: v })}
              trackColor={{ false: '#2A2D3A', true: 'rgba(124,92,252,0.5)' }}
              thumbColor={settings.notifications ? '#7C5CFC' : '#4A4E65'}
            />
          }
        />
        <View style={styles.divider} />
        <SettingRow
          icon="🗂"
          title="Ordenar por"
          subtitle={`Atual: ${settings.sortBy === 'data' ? 'Data de criação' : 'Prioridade'}`}
          onPress={() => updateSettings({ sortBy: settings.sortBy === 'data' ? 'prioridade' : 'data' })}
          right={<Text style={styles.chevron}>›</Text>}
        />
      </View>

      <Text style={styles.sectionTitle}>Sobre o App</Text>
      <View style={styles.section}>
        <SettingRow icon="📱" title="Versão" subtitle={VERSION} />
        <View style={styles.divider} />
        <SettingRow icon="⚛️" title="Tecnologia" subtitle="React Native + Expo" />
        <View style={styles.divider} />
        <SettingRow icon="🎓" title="Disciplina" subtitle="Desenvolvimento Mobile — 3º Período" />
      </View>

      <Text style={styles.sectionTitle}>Zona de Perigo</Text>
      <View style={styles.section}>
        <SettingRow
          icon="🗑"
          title="Limpar todos os dados"
          subtitle="Remove todas as tarefas locais"
          onPress={handleClearData}
          right={<Text style={styles.chevron}>›</Text>}
          danger
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>TaskApp — Trabalho Acadêmico © 2025</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1117' },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1D24',
    margin: 16,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2A2D3A',
  },
  profileAvatar: { width: 54, height: 54, borderRadius: 27, marginRight: 14, borderWidth: 2, borderColor: '#2A2D3A' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 17, fontWeight: '700', color: '#F4F4F5' },
  profileEmail: { fontSize: 12, color: '#8B8FA8', marginTop: 2 },
  profileBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(34,197,94,0.12)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  profileBadgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E' },
  profileBadgeText: { fontSize: 12, color: '#22C55E', fontWeight: '600' },
  progressCard: {
    backgroundColor: '#1A1D24',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2A2D3A',
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  progressLabel: { fontSize: 14, fontWeight: '600', color: '#F4F4F5' },
  progressPercent: { fontSize: 20, fontWeight: '800', color: '#7C5CFC' },
  progressBarBg: { height: 8, backgroundColor: '#2A2D3A', borderRadius: 4, marginBottom: 8 },
  progressBarFill: { height: 8, backgroundColor: '#7C5CFC', borderRadius: 4, minWidth: 8 },
  progressSub: { fontSize: 12, color: '#8B8FA8' },
  statsRow: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, gap: 10 },
  statCard: { flex: 1, backgroundColor: '#1A1D24', borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#2A2D3A' },
  statNumber: { fontSize: 24, fontWeight: '800', color: '#F4F4F5' },
  statLabel: { fontSize: 11, color: '#8B8FA8', marginTop: 2, fontWeight: '600' },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#4A4E65', textTransform: 'uppercase', letterSpacing: 0.8, marginHorizontal: 20, marginBottom: 8, marginTop: 4 },
  section: {
    backgroundColor: '#1A1D24',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2D3A',
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  rowIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#222630', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  rowIconDanger: { backgroundColor: 'rgba(255,71,87,0.1)' },
  rowIconText: { fontSize: 17 },
  rowContent: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: '600', color: '#F4F4F5' },
  rowTitleDanger: { color: '#FF4757' },
  rowSubtitle: { fontSize: 12, color: '#8B8FA8', marginTop: 2 },
  rowRight: {},
  chevron: { fontSize: 22, color: '#4A4E65' },
  divider: { height: 1, backgroundColor: '#2A2D3A', marginLeft: 66 },
  logoutButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: 'rgba(255,71,87,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,71,87,0.25)',
    alignItems: 'center',
  },
  logoutText: { fontSize: 15, color: '#FF4757', fontWeight: '700' },
  footer: { alignItems: 'center', paddingVertical: 24 },
  footerText: { fontSize: 12, color: '#4A4E65' },
});
