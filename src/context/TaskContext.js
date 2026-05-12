import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabase';

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

const TaskContext = createContext();

const INITIAL_TASKS = [
  {
    id: '1',
    title: 'Estudar React Native',
    description: 'Revisar componentes básicos: View, Text, FlatList, Image.',
    category: 'Estudos',
    priority: 'Alta',
    status: 'pendente',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Entregar trabalho acadêmico',
    description: 'Finalizar o projeto mobile e enviar no portal.',
    category: 'Faculdade',
    priority: 'Alta',
    status: 'pendente',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Fazer exercícios físicos',
    description: '30 minutos de caminhada ou corrida.',
    category: 'Saúde',
    priority: 'Média',
    status: 'concluído',
    createdAt: new Date().toISOString(),
  },
];

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const userRef = useRef(null);
  const deleteTimers = useRef({});
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    sortBy: 'data',
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        userRef.current = session.user;
        setUser(session.user);
        loadTasksFromSupabase(session.user.id);
      } else {
        loadLocalTasks();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        userRef.current = session.user;
        setUser(session.user);
        loadTasksFromSupabase(session.user.id);
      } else {
        userRef.current = null;
        setUser(null);
        loadLocalTasks();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadTasksFromSupabase(userId) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      setTasks([]);
    }
    loadSettings();
  }

  async function loadLocalTasks() {
    try {
      const storedTasks = await AsyncStorage.getItem('@tasks');
      setTasks(storedTasks ? JSON.parse(storedTasks) : INITIAL_TASKS);
    } catch {
      setTasks(INITIAL_TASKS);
    }
    loadSettings();
  }

  async function loadSettings() {
    try {
      const storedSettings = await AsyncStorage.getItem('@settings');
      if (storedSettings) setSettings(JSON.parse(storedSettings));
    } catch {}
  }

  async function saveTasks(newTasks) {
    setTasks(newTasks);
    await AsyncStorage.setItem('@tasks', JSON.stringify(newTasks));
  }

  async function addTask(task) {
    const currentUser = userRef.current;
    const newTask = {
      ...task,
      id: generateUUID(),
      status: 'pendente',
      createdAt: new Date().toISOString(),
    };

    if (currentUser) {
      const { error } = await supabase
        .from('tasks')
        .insert([{
          id: newTask.id,
          title: newTask.title,
          description: newTask.description || null,
          category: newTask.category,
          priority: newTask.priority,
          status: newTask.status,
          user_id: currentUser.id,
          created_at: newTask.createdAt,
        }]);

      if (error) {
        Alert.alert('Erro ao salvar tarefa', error.message);
        return false;
      }
    }

    setTasks(prev => [...prev, newTask]);
    if (!currentUser) {
      await AsyncStorage.setItem('@tasks', JSON.stringify([...tasks, newTask]));
    }
    return true;
  }

  async function updateTask(updatedTask) {
    if (user) {
      try {
        const { error } = await supabase
          .from('tasks')
          .update({
            title: updatedTask.title,
            description: updatedTask.description,
            category: updatedTask.category,
            priority: updatedTask.priority,
            status: updatedTask.status,
          })
          .eq('id', updatedTask.id)
          .eq('user_id', user.id);

        if (error) throw error;
      } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
      }
    }

    saveTasks(tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)));
  }

  async function deleteTask(id) {
    if (userRef.current) {
      try {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', id)
          .eq('user_id', userRef.current.id);

        if (error) throw error;
      } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
      }
    }

    setTasks(prev => {
      const next = prev.filter(t => t.id !== id);
      AsyncStorage.setItem('@tasks', JSON.stringify(next));
      return next;
    });
  }

  async function toggleStatus(id) {
    const task = tasks.find(t => t.id === id);
    const newStatus = task?.status === 'concluído' ? 'pendente' : 'concluído';

    if (deleteTimers.current[id]) {
      clearTimeout(deleteTimers.current[id]);
      delete deleteTimers.current[id];
    }

    if (user) {
      try {
        const { error } = await supabase
          .from('tasks')
          .update({ status: newStatus })
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) throw error;
      } catch (error) {
        console.error('Erro ao alternar status:', error);
      }
    }

    saveTasks(
      tasks.map(t =>
        t.id === id
          ? { ...t, status: newStatus }
          : t
      )
    );

    if (newStatus === 'concluído') {
      deleteTimers.current[id] = setTimeout(() => {
        delete deleteTimers.current[id];
        deleteTask(id);
      }, 10000);
    }
  }

  async function updateSettings(newSettings) {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    await AsyncStorage.setItem('@settings', JSON.stringify(merged));
  }

  return (
    <TaskContext.Provider
      value={{ tasks, user, setUser, settings, addTask, updateTask, deleteTask, toggleStatus, updateSettings }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}
