import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useTasks } from '../context/TaskContext';

const CATEGORIES = ['Estudos', 'Faculdade', 'Saúde', 'Trabalho', 'Pessoal'];
const PRIORITIES = ['Alta', 'Média', 'Baixa'];
const PRIORITY_COLORS = { Alta: '#FF4757', Média: '#FFB547', Baixa: '#22C55E' };
const PRIORITY_BG = { Alta: 'rgba(255,71,87,0.15)', Média: 'rgba(255,181,71,0.15)', Baixa: 'rgba(34,197,94,0.15)' };

export default function TaskDetailScreen({ navigation, route }) {
  const { taskId } = route.params;
  const { tasks, updateTask, deleteTask, toggleStatus } = useTasks();
  const task = tasks.find(t => t.id === taskId);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setCategory(task.category);
      setPriority(task.priority);
    }
  }, [task]);

  if (!task) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Tarefa não encontrada.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>← Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function handleSave() {
    if (!title.trim()) {
      Alert.alert('Campo obrigatório', 'O título não pode ficar em branco.');
      return;
    }
    updateTask({ ...task, title: title.trim(), description: description.trim(), category, priority });
    setIsEditing(false);
  }

  function handleDelete() {
    Alert.alert('Excluir tarefa', 'Tem certeza? Esta ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => { deleteTask(task.id); navigation.goBack(); } },
    ]);
  }

  function handleCancel() {
    setTitle(task.title);
    setDescription(task.description || '');
    setCategory(task.category);
    setPriority(task.priority);
    setIsEditing(false);
  }

  const isCompleted = task.status === 'concluído';

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {isEditing ? 'Editando' : 'Detalhes'}
        </Text>
        <TouchableOpacity
          onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
          style={styles.editBtn}
        >
          <Text style={styles.editText}>{isEditing ? 'Salvar' : 'Editar'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Status Banner */}
        <TouchableOpacity
          style={[styles.statusBanner, isCompleted ? styles.statusDone : styles.statusPending]}
          onPress={() => toggleStatus(task.id)}
          activeOpacity={0.8}
        >
          <View style={[styles.statusDot, { backgroundColor: isCompleted ? '#22C55E' : '#7C5CFC' }]} />
          <View style={styles.statusContent}>
            <Text style={styles.statusLabel}>Status atual</Text>
            <Text style={[styles.statusValue, { color: isCompleted ? '#22C55E' : '#9D84FD' }]}>
              {isCompleted ? '✓ Concluída' : '○ Pendente'}
            </Text>
          </View>
          <Text style={styles.statusTap}>Toque para alternar →</Text>
        </TouchableOpacity>

        {/* Title */}
        <View style={styles.field}>
          <Text style={styles.label}>Título</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              maxLength={80}
              placeholder="Título da tarefa"
              placeholderTextColor="#4A4E65"
            />
          ) : (
            <Text style={styles.value}>{task.title}</Text>
          )}
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.label}>Descrição</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={300}
              placeholder="Descrição opcional..."
              placeholderTextColor="#4A4E65"
              textAlignVertical="top"
            />
          ) : (
            <Text style={[styles.value, !task.description && styles.valueMuted]}>
              {task.description || 'Sem descrição'}
            </Text>
          )}
        </View>

        {/* Category */}
        <View style={styles.field}>
          <Text style={styles.label}>Categoria</Text>
          {isEditing ? (
            <View style={styles.optionsRow}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.optionChip, category === cat && styles.optionChipActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.optionText, category === cat && styles.optionTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{task.category}</Text>
            </View>
          )}
        </View>

        {/* Priority */}
        <View style={styles.field}>
          <Text style={styles.label}>Prioridade</Text>
          {isEditing ? (
            <View style={styles.priorityRow}>
              {PRIORITIES.map(p => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityChip,
                    priority === p && { backgroundColor: PRIORITY_BG[p], borderColor: PRIORITY_COLORS[p] },
                  ]}
                  onPress={() => setPriority(p)}
                >
                  <View style={[styles.priorityDot, { backgroundColor: PRIORITY_COLORS[p] }]} />
                  <Text style={[styles.priorityText, priority === p && { color: PRIORITY_COLORS[p] }]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={[styles.priorityBadge, { backgroundColor: PRIORITY_BG[task.priority] }]}>
              <View style={[styles.priorityDot, { backgroundColor: PRIORITY_COLORS[task.priority] }]} />
              <Text style={[styles.priorityBadgeText, { color: PRIORITY_COLORS[task.priority] }]}>{task.priority}</Text>
            </View>
          )}
        </View>

        {/* Created At */}
        <View style={styles.field}>
          <Text style={styles.label}>Criada em</Text>
          <Text style={styles.value}>
            {new Date(task.createdAt).toLocaleDateString('pt-BR', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Action Buttons */}
        {isEditing ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteText}>Excluir Tarefa</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#0F1117' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2D3A',
  },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#1A1D24', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2A2D3A' },
  backText: { fontSize: 18, color: '#F4F4F5', fontWeight: 'bold' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#F4F4F5' },
  editBtn: { backgroundColor: 'rgba(124,92,252,0.15)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(124,92,252,0.3)' },
  editText: { color: '#9D84FD', fontWeight: '700', fontSize: 14 },
  container: { padding: 20, paddingBottom: 40 },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  statusDone: { backgroundColor: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.25)' },
  statusPending: { backgroundColor: 'rgba(124,92,252,0.08)', borderColor: 'rgba(124,92,252,0.25)' },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 14 },
  statusContent: { flex: 1 },
  statusLabel: { fontSize: 11, color: '#8B8FA8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  statusValue: { fontSize: 16, fontWeight: '700', marginTop: 2 },
  statusTap: { fontSize: 11, color: '#4A4E65' },
  field: { marginBottom: 22 },
  label: { fontSize: 11, fontWeight: '700', color: '#8B8FA8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  value: { fontSize: 16, color: '#F4F4F5', lineHeight: 24 },
  valueMuted: { color: '#4A4E65', fontStyle: 'italic' },
  input: {
    backgroundColor: '#1A1D24',
    borderWidth: 1,
    borderColor: '#2A2D3A',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#F4F4F5',
  },
  textArea: { minHeight: 100 },
  badge: { backgroundColor: 'rgba(124,92,252,0.12)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  badgeText: { color: '#9D84FD', fontWeight: '700', fontSize: 13 },
  priorityBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  priorityBadgeText: { fontWeight: '700', fontSize: 13 },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, backgroundColor: '#1A1D24', borderWidth: 1, borderColor: '#2A2D3A' },
  optionChipActive: { backgroundColor: 'rgba(124,92,252,0.15)', borderColor: '#7C5CFC' },
  optionText: { fontSize: 13, color: '#8B8FA8', fontWeight: '600' },
  optionTextActive: { color: '#9D84FD' },
  priorityRow: { flexDirection: 'row', gap: 10 },
  priorityChip: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 12, backgroundColor: '#1A1D24', borderWidth: 1, borderColor: '#2A2D3A' },
  priorityText: { fontSize: 13, color: '#8B8FA8', fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#2A2D3A', marginBottom: 22 },
  buttonRow: { flexDirection: 'row', gap: 12 },
  cancelButton: { flex: 1, paddingVertical: 15, borderRadius: 14, backgroundColor: '#1A1D24', borderWidth: 1, borderColor: '#2A2D3A', alignItems: 'center' },
  cancelText: { fontSize: 15, color: '#8B8FA8', fontWeight: '600' },
  saveButton: { flex: 2, paddingVertical: 15, borderRadius: 14, backgroundColor: '#7C5CFC', alignItems: 'center' },
  saveText: { fontSize: 15, color: '#FFF', fontWeight: '700' },
  deleteButton: {
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: 'rgba(255,71,87,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,71,87,0.25)',
    alignItems: 'center',
  },
  deleteText: { fontSize: 15, color: '#FF4757', fontWeight: '600' },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F1117' },
  notFoundText: { fontSize: 16, color: '#8B8FA8', marginBottom: 12 },
  backLink: { color: '#7C5CFC', fontSize: 16, fontWeight: '600' },
});
