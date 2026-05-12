# TaskApp

Aplicativo mobile de gerenciamento de tarefas desenvolvido com React Native e Expo.

## Funcionalidades

- Autenticação com e-mail e senha via Supabase
- Criar, editar e excluir tarefas
- Categorias: Estudos, Faculdade, Saúde, Trabalho, Pessoal
- Prioridades: Alta, Média, Baixa
- Filtros por status (Pendentes / Concluídas) e por categoria
- Busca por título
- Tarefas concluídas são removidas automaticamente após 10 segundos
- Sincronização em tempo real com Supabase
- Armazenamento local com AsyncStorage (modo offline)

## Tecnologias

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/) ~54.0
- [Supabase](https://supabase.com/) — autenticação e banco de dados
- [React Navigation](https://reactnavigation.org/) — navegação por tabs e stack
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) — persistência local

## Pré-requisitos

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Conta no [Supabase](https://supabase.com/)

## Instalação

```bash
# Clone o repositório
git clone https://github.com/crispim234/TaskApp.git
cd TaskApp

# Instale as dependências
npm install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto com as credenciais do Supabase:

```env
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

## Execução

```bash
# Iniciar o servidor de desenvolvimento
npm start

# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## Estrutura do Projeto

```
TaskApp/
├── App.js                          # Navegação principal
├── app.json                        # Configuração Expo
├── assets/                         # Imagens e ícones
└── src/
    ├── config/
    │   └── supabase.js             # Configuração do cliente Supabase
    ├── context/
    │   └── TaskContext.js          # Estado global das tarefas
    ├── components/
    │   └── TaskItem.js             # Componente de item da lista
    └── screens/
        ├── SplashScreen.js
        ├── LoginScreen.js
        ├── HomeScreen.js
        ├── AddTaskScreen.js
        ├── TaskDetailScreen.js
        └── SettingsScreen.js
```

## Banco de Dados (Supabase)

Tabela `tasks`:

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid | Chave primária |
| user_id | uuid | FK para auth.users |
| title | text | Título da tarefa |
| description | text | Descrição opcional |
| category | text | Categoria |
| priority | text | Alta / Média / Baixa |
| status | text | pendente / concluído |
| created_at | timestamptz | Data de criação |
