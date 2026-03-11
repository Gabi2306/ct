-- =============================================
-- Script 3: Tabla de Actividades (activities)
-- Ejecuta este script TERCERO en Supabase SQL Editor
-- =============================================

-- Tabla de actividades/emisiones
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('food', 'transport')),
  name TEXT NOT NULL,
  emissions NUMERIC(10, 2) NOT NULL DEFAULT 0,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Politicas de seguridad
CREATE POLICY "activities_select_own" ON public.activities 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "activities_insert_own" ON public.activities 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "activities_delete_own" ON public.activities 
  FOR DELETE USING (auth.uid() = user_id);

-- Indices para consultas rapidas
CREATE INDEX idx_activities_user_id ON public.activities(user_id);
CREATE INDEX idx_activities_created_at ON public.activities(created_at DESC);
CREATE INDEX idx_activities_user_date ON public.activities(user_id, created_at DESC);
