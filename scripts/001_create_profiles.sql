-- =============================================
-- Script 1: Tabla de Perfiles (profiles)
-- Ejecuta este script PRIMERO en Supabase SQL Editor
-- =============================================

-- Eliminar tabla existente si hay (CUIDADO: esto borra datos existentes)
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Tabla de perfiles de usuario
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT,
  friend_code TEXT UNIQUE DEFAULT UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 8)),
  notification_enabled BOOLEAN DEFAULT false,
  notification_time TIME DEFAULT '09:00:00',
  push_subscription JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politicas de seguridad
CREATE POLICY "profiles_select_own" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- Politica para buscar amigos por codigo (lectura publica del codigo y nombre)
CREATE POLICY "profiles_select_by_friend_code" ON public.profiles 
  FOR SELECT USING (true);

-- Indice para busqueda rapida por codigo de amigo
CREATE INDEX idx_profiles_friend_code ON public.profiles(friend_code);
