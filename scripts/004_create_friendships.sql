-- =============================================
-- Script 4: Tabla de Amistades (friendships)
-- Ejecuta este script CUARTO en Supabase SQL Editor
-- =============================================

-- Tabla de solicitudes de amistad y amistades
CREATE TABLE IF NOT EXISTS public.friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, addressee_id)
);

-- Habilitar RLS
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

-- Politicas: ver solicitudes donde soy parte
CREATE POLICY "friendships_select" ON public.friendships 
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- Politicas: crear solicitud (solo como requester)
CREATE POLICY "friendships_insert" ON public.friendships 
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

-- Politicas: actualizar (solo el destinatario puede aceptar/rechazar)
CREATE POLICY "friendships_update" ON public.friendships 
  FOR UPDATE USING (auth.uid() = addressee_id);

-- Politicas: eliminar (ambas partes pueden eliminar la amistad)
CREATE POLICY "friendships_delete" ON public.friendships 
  FOR DELETE USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- Indices
CREATE INDEX idx_friendships_requester ON public.friendships(requester_id);
CREATE INDEX idx_friendships_addressee ON public.friendships(addressee_id);
CREATE INDEX idx_friendships_status ON public.friendships(status);
