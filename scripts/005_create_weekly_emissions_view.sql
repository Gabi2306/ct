-- =============================================
-- Script 5: Vista para ranking semanal
-- Ejecuta este script QUINTO en Supabase SQL Editor
-- =============================================

-- Vista para calcular emisiones semanales de usuarios
CREATE OR REPLACE VIEW public.weekly_emissions AS
SELECT 
  p.id as user_id,
  p.name,
  p.friend_code,
  COALESCE(SUM(a.emissions), 0) as total_emissions,
  DATE_TRUNC('week', NOW()) as week_start
FROM public.profiles p
LEFT JOIN public.activities a ON p.id = a.user_id 
  AND a.created_at >= DATE_TRUNC('week', NOW())
  AND a.created_at < DATE_TRUNC('week', NOW()) + INTERVAL '7 days'
GROUP BY p.id, p.name, p.friend_code;
