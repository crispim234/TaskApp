import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput,
  StyleSheet, Image, Alert,
} from 'react-native';
import { useTasks } from '../context/TaskContext';
import TaskItem from '../components/TaskItem';

const FILTERS = ['Todas', 'Pendentes', 'Concluídas'];
const CATEGORIES = ['Todas', 'Estudos', 'Faculdade', 'Saúde', 'Trabalho', 'Pessoal'];

export default function HomeScreen({ navigation }) {
  const { tasks, toggleStatus, deleteTask, user } = useTasks();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Todas');
  const [category, setCategory] = useState('Todas');

  const filtered = useMemo(() => {
    return tasks.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        filter === 'Todas' ||
        (filter === 'Pendentes' && t.status === 'pendente') ||
        (filter === 'Concluídas' && t.status === 'concluído');
      const matchCategory = category === 'Todas' || t.category === category;
      return matchSearch && matchFilter && matchCategory;
    });
  }, [tasks, search, filter, category]);

  const pending = tasks.filter(t => t.status === 'pendente').length;
  const done = tasks.filter(t => t.status === 'concluído').length;

  function renderEmpty() {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
          <Text style={styles.emptyIconText}>✓</Text>
        </View>
        <Text style={styles.emptyTitle}>Nenhuma tarefa encontrada</Text>
        <Text style={styles.emptySubtitle}>Toque no + para adicionar uma nova tarefa</Text>
      </View>
    );
  }

  const firstName = user?.user_metadata?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'Usuário';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {firstName} 👋</Text>
          <Text style={styles.headerSub}>
            {pending === 0
              ? 'Tudo em dia! Sem pendências.'
              : `Você tem ${pending} tarefa${pending !== 1 ? 's' : ''} pendente${pending !== 1 ? 's' : ''}`}
          </Text>
        </View>
        <Image source={require('../../assets/avatar.png')} style={styles.avatar} />
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{tasks.length}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
        <View style={[styles.summaryCard, styles.summaryCardAccent]}>
          <Text style={[styles.summaryNumber, { color: '#7C5CFC' }]}>{pending}</Text>
          <Text style={styles.summaryLabel}>Pendentes</Text>
        </View>
        <View style={[styles.summaryCard, styles.summaryCardGreen]}>
          <Text style={[styles.summaryNumber, { color: '#22C55E' }]}>{done}</Text>
          <Text style={styles.summaryLabel}>Concluídas</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar tarefas..."
          placeholderTextColor="#4A4E65"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearSearch}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Status Filter */}
      <View style={styles.filtersRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Category Filter */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={CATEGORIES}
        keyExtractor={item => item}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoryChip, category === item && styles.categoryChipActive]}
            onPress={() => setCategory(item)}
          >
            <Text style={[styles.categoryText, category === item && styles.categoryTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Task List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
            onToggle={() => toggleStatus(item.id)}
          />
        )}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={filtered.length === 0 ? styles.emptyList : { paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddTask')} activeOpacity={0.85}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1117' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: { fontSize: 22, fontWeight: '800', color: '#F4F4F5' },
  headerSub: { fontSize: 13, color: '#8B8FA8', marginTop: 3 },
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#2A2D3A' },
  summaryRow: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, gap: 10 },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    backgroundColor: '#1A1D24',
    borderWidth: 1,
    borderColor: '#2A2D3A',
  },
  summaryCardAccent: { borderColor: 'rgba(124, 92, 252, 0.3)' },
  summaryCardGreen: { borderColor: 'rgba(34, 197, 94, 0.3)' },
  summaryNumber: { fontSize: 26, fontWeight: '800', color: '#F4F4F5' },
  summaryLabel: { fontSize: 11, color: '#8B8FA8', marginTop: 2, fontWeight: '600' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1D24',
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#2A2D3A',
  },
  searchIcon: { fontSize: 15, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14, color: '#F4F4F5' },
  clearSearch: { fontSize: 14, color: '#4A4E65', padding: 4 },
  filtersRow: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 8, gap: 8 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#1A1D24',
    borderWidth: 1,
    borderColor: '#2A2D3A',
  },
  filterChipActive: { backgroundColor: '#7C5CFC', borderColor: '#7C5CFC' },
  filterText: { fontSize: 13, color: '#8B8FA8', fontWeight: '600' },
  filterTextActive: { color: '#FFF' },
  categoryList: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#1A1D24',
    borderWidth: 1,
    borderColor: '#2A2D3A',
  },
  categoryChipActive: { backgroundColor: 'rgba(124, 92, 252, 0.2)', borderColor: '#7C5CFC' },
  categoryText: { fontSize: 12, color: '#8B8FA8', fontWeight: '600' },
  categoryTextActive: { color: '#9D84FD' },
  emptyList: { flex: 1 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(124, 92, 252, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(124, 92, 252, 0.25)',
  },
  emptyIconText: { fontSize: 30, color: '#7C5CFC' },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#F4F4F5', marginBottom: 8 },
  emptySubtitle: { fontSize: 13, color: '#8B8FA8', textAlign: 'center' },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    backgroundColor: '#7C5CFC',
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C5CFC',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  fabIcon: { fontSize: 28, color: '#FFF', fontWeight: '300', lineHeight: 32 },
});
