import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type Priority = 'Alta' | 'Média' | 'Baixa';
export type TaskStatus = 'pendente' | 'concluído';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: Priority;
  status: TaskStatus;
  createdAt: string;
  created_at?: string;
  user_id?: string;
}

export interface Settings {
  theme: string;
  notifications: boolean;
  sortBy: string;
}

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Main: undefined;
  AddTask: undefined;
  TaskDetail: { taskId: string };
};

export type TabParamList = {
  Home: undefined;
  Settings: undefined;
};

export type SplashScreenProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type AddTaskScreenProps = NativeStackScreenProps<RootStackParamList, 'AddTask'>;
export type TaskDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;

export type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type SettingsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Settings'>,
  NativeStackScreenProps<RootStackParamList>
>;
