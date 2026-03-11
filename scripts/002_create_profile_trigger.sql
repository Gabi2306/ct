-- =============================================
-- Script 2: Trigger para crear perfil automaticamente
-- Ejecuta este script SEGUNDO en Supabase SQL Editor
-- =============================================

-- Funcion que crea el perfil automaticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, friend_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', ''),
    NEW.email,
    UPPER(SUBSTR(MD5(NEW.id::TEXT || NOW()::TEXT), 1, 8))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Eliminar trigger existente si hay
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Crear trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
