import { createClient } from '@supabase/supabase-js';

// Substitua com suas credenciais do Supabase
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://seu-projeto.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sua-chave-anonima';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
