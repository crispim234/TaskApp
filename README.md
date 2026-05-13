# 📋 TaskApp

> Aplicativo mobile de gerenciamento de tarefas — organizado, simples e eficiente.

![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=flat-square&logo=react)
![Expo](https://img.shields.io/badge/Expo-54.0-000020?style=flat-square&logo=expo)
![Supabase](https://img.shields.io/badge/Supabase-2.x-3ECF8E?style=flat-square&logo=supabase)

---

## ✨ Funcionalidades

- 🔐 **Autenticação** — login e cadastro com e-mail e senha
- ✅ **Tarefas** — criar, editar, concluir e excluir
- 🏷️ **Categorias** — Estudos, Faculdade, Saúde, Trabalho, Pessoal
- 🔥 **Prioridades** — Alta, Média e Baixa
- 🔍 **Busca e filtros** — por título, status e categoria
- ⏱️ **Auto-remoção** — tarefas concluídas são removidas automaticamente após 10 segundos
- ☁️ **Sincronização** — dados salvos em tempo real no Supabase
- 📦 **Offline** — funciona localmente com AsyncStorage

---

## 📱 Telas

| Tela | Descrição |
|------|-----------|
| Splash | Animação de entrada do app |
| Login | Autenticação e cadastro |
| Home | Lista de tarefas com filtros e busca |
| Nova Tarefa | Formulário com pré-visualização |
| Detalhes | Visualizar e editar uma tarefa |
| Configurações | Perfil, progresso e preferências |

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React Native | 0.81.5 | Framework mobile |
| Expo | ~54.0 | Toolchain e build |
| Supabase | ^2.105 | Banco de dados e autenticação |
| React Navigation | ^6.x | Navegação entre telas |
| AsyncStorage | 2.2.0 | Persistência local |

---

## 🚀 Como rodar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- [Expo Go](https://expo.dev/go) no celular (para testar)
- Conta no [Supabase](https://supabase.com/)

### Passo a passo

**1. Clone o repositório**
```bash
git clone https://github.com/crispim234/TaskApp.git
cd TaskApp
```

**2. Instale as dependências**
```bash
npm install
```

**3. Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:
```env
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

**4. Inicie o app**
```bash
npm start
```

Escaneie o QR code com o Expo Go ou rode em um emulador:
```bash
npm run android   # Android
npm run ios       # iOS
npm run web       # Navegador
```

---

## 🗂️ Estrutura do Projeto

```
TaskApp/
├── App.js                      # Configuração de navegação
├── app.json                    # Configuração do Expo
├── assets/                     # Imagens e ícones
└── src/
    ├── config/
    │   └── supabase.js         # Cliente Supabase
    ├── context/
    │   └── TaskContext.js      # Estado global (tarefas, auth)
    ├── components/
    │   └── TaskItem.js         # Card de tarefa
    └── screens/
        ├── SplashScreen.js
        ├── LoginScreen.js
        ├── HomeScreen.js
        ├── AddTaskScreen.js
        ├── TaskDetailScreen.js
        └── SettingsScreen.js
```

---

## 🗄️ Banco de Dados

Tabela `tasks` no Supabase:

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid | Chave primária |
| `user_id` | uuid | Referência ao usuário |
| `title` | text | Título da tarefa |
| `description` | text | Descrição opcional |
| `category` | text | Categoria |
| `priority` | text | Alta / Média / Baixa |
| `status` | text | pendente / concluído |
| `created_at` | timestamptz | Data de criação |

---

## 📄 Licença

Projeto acadêmico — Desenvolvimento Mobile · 3º Período
