-- =============================================
-- SCRIPT DE DATOS DE PRUEBA
-- Ejecutar DESPUES de los scripts 001-004
-- =============================================
-- 
-- INSTRUCCIONES:
-- 1. Primero, registra manualmente estos 3 usuarios en la app:
--    - ejemplo1@gmail.com (contraseña: test123)
--    - ejemplo2@gmail.com (contraseña: test123)
--    - ejemplo3@gmail.com (contraseña: test123)
-- 
-- 2. Luego ejecuta este script para agregar actividades y amistades
-- =============================================

-- Actualizar nombres y friend_codes de los usuarios existentes
UPDATE profiles 
SET name = 'Carlos García', friend_code = 'CARL1234'
WHERE email = 'ejemplo1@gmail.com';

UPDATE profiles 
SET name = 'María López', friend_code = 'MARI5678'
WHERE email = 'ejemplo2@gmail.com';

UPDATE profiles 
SET name = 'Juan Rodríguez', friend_code = 'JUAN9ABC'
WHERE email = 'ejemplo3@gmail.com';

-- Hacer que los 3 usuarios sean amigos entre sí
-- (usando subqueries para obtener los IDs reales)
INSERT INTO friendships (user_id, friend_id, status, created_at)
SELECT 
  (SELECT id FROM profiles WHERE email = 'ejemplo1@gmail.com'),
  (SELECT id FROM profiles WHERE email = 'ejemplo2@gmail.com'),
  'accepted', NOW() - INTERVAL '10 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo1@gmail.com')
  AND EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo2@gmail.com')
ON CONFLICT DO NOTHING;

INSERT INTO friendships (user_id, friend_id, status, created_at)
SELECT 
  (SELECT id FROM profiles WHERE email = 'ejemplo2@gmail.com'),
  (SELECT id FROM profiles WHERE email = 'ejemplo1@gmail.com'),
  'accepted', NOW() - INTERVAL '10 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo1@gmail.com')
  AND EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo2@gmail.com')
ON CONFLICT DO NOTHING;

INSERT INTO friendships (user_id, friend_id, status, created_at)
SELECT 
  (SELECT id FROM profiles WHERE email = 'ejemplo1@gmail.com'),
  (SELECT id FROM profiles WHERE email = 'ejemplo3@gmail.com'),
  'accepted', NOW() - INTERVAL '8 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo1@gmail.com')
  AND EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo3@gmail.com')
ON CONFLICT DO NOTHING;

INSERT INTO friendships (user_id, friend_id, status, created_at)
SELECT 
  (SELECT id FROM profiles WHERE email = 'ejemplo3@gmail.com'),
  (SELECT id FROM profiles WHERE email = 'ejemplo1@gmail.com'),
  'accepted', NOW() - INTERVAL '8 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo1@gmail.com')
  AND EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo3@gmail.com')
ON CONFLICT DO NOTHING;

INSERT INTO friendships (user_id, friend_id, status, created_at)
SELECT 
  (SELECT id FROM profiles WHERE email = 'ejemplo2@gmail.com'),
  (SELECT id FROM profiles WHERE email = 'ejemplo3@gmail.com'),
  'accepted', NOW() - INTERVAL '5 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo2@gmail.com')
  AND EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo3@gmail.com')
ON CONFLICT DO NOTHING;

INSERT INTO friendships (user_id, friend_id, status, created_at)
SELECT 
  (SELECT id FROM profiles WHERE email = 'ejemplo3@gmail.com'),
  (SELECT id FROM profiles WHERE email = 'ejemplo2@gmail.com'),
  'accepted', NOW() - INTERVAL '5 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo2@gmail.com')
  AND EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo3@gmail.com')
ON CONFLICT DO NOTHING;

-- =============================================
-- ACTIVIDADES DE LA SEMANA PASADA
-- =============================================

-- Carlos García - Semana pasada (emisiones moderadas)
INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo1@gmail.com'), 'Hamburguesa con papas', 'food', 3.2, NOW() - INTERVAL '10 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo1@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo1@gmail.com'), 'Viaje en auto al trabajo', 'transport', 2.5, NOW() - INTERVAL '10 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo1@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo1@gmail.com'), 'Pollo asado', 'food', 1.8, NOW() - INTERVAL '9 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo1@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo1@gmail.com'), 'Viaje en bus', 'transport', 0.3, NOW() - INTERVAL '9 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo1@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo1@gmail.com'), 'Pizza familiar', 'food', 2.1, NOW() - INTERVAL '8 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo1@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo1@gmail.com'), 'Uber al centro', 'transport', 1.8, NOW() - INTERVAL '8 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo1@gmail.com');

-- María López - Semana pasada (bajas emisiones - muy ecológica)
INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo2@gmail.com'), 'Ensalada vegana', 'food', 0.4, NOW() - INTERVAL '10 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo2@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo2@gmail.com'), 'Bicicleta al trabajo', 'transport', 0.0, NOW() - INTERVAL '10 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo2@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo2@gmail.com'), 'Pasta con verduras', 'food', 0.6, NOW() - INTERVAL '9 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo2@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo2@gmail.com'), 'Caminata', 'transport', 0.0, NOW() - INTERVAL '9 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo2@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo2@gmail.com'), 'Sopa de lentejas', 'food', 0.3, NOW() - INTERVAL '8 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo2@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo2@gmail.com'), 'Metro', 'transport', 0.1, NOW() - INTERVAL '8 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo2@gmail.com');

-- Juan Rodríguez - Semana pasada (altas emisiones)
INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo3@gmail.com'), 'Carne asada BBQ', 'food', 5.2, NOW() - INTERVAL '10 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo3@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo3@gmail.com'), 'Viaje en avión corto', 'transport', 15.0, NOW() - INTERVAL '10 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo3@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo3@gmail.com'), 'Costillas de cerdo', 'food', 3.8, NOW() - INTERVAL '9 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo3@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo3@gmail.com'), 'Taxi aeropuerto', 'transport', 4.2, NOW() - INTERVAL '9 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo3@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo3@gmail.com'), 'Filete de res', 'food', 6.1, NOW() - INTERVAL '8 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo3@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo3@gmail.com'), 'Auto particular', 'transport', 3.5, NOW() - INTERVAL '8 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo3@gmail.com');

-- =============================================
-- ACTIVIDADES DE ESTA SEMANA
-- =============================================

-- Carlos García - Esta semana (mejorando)
INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo1@gmail.com'), 'Tacos de pollo', 'food', 1.2, NOW() - INTERVAL '3 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo1@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo1@gmail.com'), 'Metro al trabajo', 'transport', 0.2, NOW() - INTERVAL '3 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo1@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo1@gmail.com'), 'Sandwich de atún', 'food', 0.8, NOW() - INTERVAL '2 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo1@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo1@gmail.com'), 'Bicicleta', 'transport', 0.0, NOW() - INTERVAL '2 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo1@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo1@gmail.com'), 'Arroz con frijoles', 'food', 0.5, NOW() - INTERVAL '1 day'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo1@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo1@gmail.com'), 'Caminar', 'transport', 0.0, NOW() - INTERVAL '1 day'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo1@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo1@gmail.com'), 'Café con leche', 'food', 0.3, NOW()
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo1@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo1@gmail.com'), 'Bus eléctrico', 'transport', 0.1, NOW()
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo1@gmail.com');

-- María López - Esta semana (sigue siendo ecológica)
INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo2@gmail.com'), 'Bowl de quinoa', 'food', 0.3, NOW() - INTERVAL '3 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo2@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo2@gmail.com'), 'Scooter eléctrico', 'transport', 0.05, NOW() - INTERVAL '3 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo2@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo2@gmail.com'), 'Wrap vegetariano', 'food', 0.4, NOW() - INTERVAL '2 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo2@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo2@gmail.com'), 'Bicicleta', 'transport', 0.0, NOW() - INTERVAL '2 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo2@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo2@gmail.com'), 'Smoothie de frutas', 'food', 0.2, NOW() - INTERVAL '1 day'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo2@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo2@gmail.com'), 'Caminata', 'transport', 0.0, NOW() - INTERVAL '1 day'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo2@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo2@gmail.com'), 'Avena con frutas', 'food', 0.15, NOW()
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo2@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo2@gmail.com'), 'Metro', 'transport', 0.1, NOW()
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo2@gmail.com');

-- Juan Rodríguez - Esta semana (intentando mejorar pero aún alto)
INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo3@gmail.com'), 'Pollo frito', 'food', 2.1, NOW() - INTERVAL '3 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo3@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo3@gmail.com'), 'Auto al trabajo', 'transport', 2.8, NOW() - INTERVAL '3 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo3@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo3@gmail.com'), 'Hamburguesa doble', 'food', 4.5, NOW() - INTERVAL '2 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo3@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo3@gmail.com'), 'Uber', 'transport', 1.5, NOW() - INTERVAL '2 days'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo3@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo3@gmail.com'), 'Sushi (con atún)', 'food', 1.8, NOW() - INTERVAL '1 day'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo3@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo3@gmail.com'), 'Bus', 'transport', 0.3, NOW() - INTERVAL '1 day'
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo3@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo3@gmail.com'), 'Hot dog', 'food', 1.2, NOW()
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo3@gmail.com');

INSERT INTO activities (user_id, name, category, emissions, created_at)
SELECT (SELECT id FROM profiles WHERE email = 'ejemplo3@gmail.com'), 'Taxi', 'transport', 1.9, NOW()
WHERE EXISTS (SELECT 1 FROM profiles WHERE email = 'ejemplo3@gmail.com');

-- =============================================
-- RESUMEN ESPERADO DEL RANKING SEMANAL:
-- 1. María López: ~1.2 kg CO2 (la más ecológica)
-- 2. Carlos García: ~3.1 kg CO2 (mejorando)
-- 3. Juan Rodríguez: ~16.1 kg CO2 (necesita mejorar)
-- =============================================
