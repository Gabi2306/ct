-- =============================================
-- SCRIPT 005 - SOLO ACTIVIDADES DE PRUEBA
-- NO modifica usuarios existentes
-- Usa alimentos y transportes válidos de carbon-data.ts
-- =============================================

-- =============================================
-- ACTIVIDADES SEMANA PASADA (hace 7-13 días)
-- =============================================

-- Usuario 1 (b1b0e13d-f711-4fea-b22d-96a582c8ddea) - Semana pasada
INSERT INTO activities (user_id, type, name, emissions, details, created_at) VALUES
-- Alimentos
('b1b0e13d-f711-4fea-b22d-96a582c8ddea', 'food', 'carne', 5.40, '200g de carne de res', NOW() - INTERVAL '10 days'),
('b1b0e13d-f711-4fea-b22d-96a582c8ddea', 'food', 'arroz', 0.80, '200g de arroz', NOW() - INTERVAL '10 days'),
('b1b0e13d-f711-4fea-b22d-96a582c8ddea', 'food', 'pollo', 1.38, '200g de pollo', NOW() - INTERVAL '9 days'),
('b1b0e13d-f711-4fea-b22d-96a582c8ddea', 'food', 'ensalada', 0.14, '200g de ensalada', NOW() - INTERVAL '9 days'),
('b1b0e13d-f711-4fea-b22d-96a582c8ddea', 'food', 'hamburguesa', 4.20, '300g hamburguesa', NOW() - INTERVAL '8 days'),
('b1b0e13d-f711-4fea-b22d-96a582c8ddea', 'food', 'cafe', 0.80, '100g de cafe', NOW() - INTERVAL '8 days'),
-- Transporte
('b1b0e13d-f711-4fea-b22d-96a582c8ddea', 'transport', 'car', 3.84, '20km en auto', NOW() - INTERVAL '10 days'),
('b1b0e13d-f711-4fea-b22d-96a582c8ddea', 'transport', 'bus', 0.89, '10km en bus', NOW() - INTERVAL '9 days'),
('b1b0e13d-f711-4fea-b22d-96a582c8ddea', 'transport', 'taxi', 2.10, '10km en taxi', NOW() - INTERVAL '8 days');

-- Usuario 2 (7e891503-4cb4-4bef-af8d-cc8fd2548c51) - Semana pasada (eco-friendly)
INSERT INTO activities (user_id, type, name, emissions, details, created_at) VALUES
-- Alimentos
('7e891503-4cb4-4bef-af8d-cc8fd2548c51', 'food', 'lentejas', 0.18, '200g de lentejas', NOW() - INTERVAL '10 days'),
('7e891503-4cb4-4bef-af8d-cc8fd2548c51', 'food', 'tofu', 0.60, '200g de tofu', NOW() - INTERVAL '10 days'),
('7e891503-4cb4-4bef-af8d-cc8fd2548c51', 'food', 'pasta', 0.30, '200g de pasta', NOW() - INTERVAL '9 days'),
('7e891503-4cb4-4bef-af8d-cc8fd2548c51', 'food', 'brocoli', 0.10, '200g de brocoli', NOW() - INTERVAL '9 days'),
('7e891503-4cb4-4bef-af8d-cc8fd2548c51', 'food', 'frijoles', 0.16, '200g de frijoles', NOW() - INTERVAL '8 days'),
('7e891503-4cb4-4bef-af8d-cc8fd2548c51', 'food', 'te', 0.12, '100g de te', NOW() - INTERVAL '8 days'),
-- Transporte
('7e891503-4cb4-4bef-af8d-cc8fd2548c51', 'transport', 'cycle', 0.00, '15km en bicicleta', NOW() - INTERVAL '10 days'),
('7e891503-4cb4-4bef-af8d-cc8fd2548c51', 'transport', 'walk', 0.00, '3km caminando', NOW() - INTERVAL '9 days'),
('7e891503-4cb4-4bef-af8d-cc8fd2548c51', 'transport', 'bus', 0.45, '5km en bus', NOW() - INTERVAL '8 days');

-- Usuario 3 (0da28ca6-9e9e-42a8-987c-9c2f1665a64a) - Semana pasada (alto consumo)
INSERT INTO activities (user_id, type, name, emissions, details, created_at) VALUES
-- Alimentos
('0da28ca6-9e9e-42a8-987c-9c2f1665a64a', 'food', 'carne', 8.10, '300g de carne de res', NOW() - INTERVAL '10 days'),
('0da28ca6-9e9e-42a8-987c-9c2f1665a64a', 'food', 'queso', 2.70, '200g de queso', NOW() - INTERVAL '10 days'),
('0da28ca6-9e9e-42a8-987c-9c2f1665a64a', 'food', 'cerdo', 3.63, '300g de cerdo', NOW() - INTERVAL '9 days'),
('0da28ca6-9e9e-42a8-987c-9c2f1665a64a', 'food', 'pizza', 2.25, '450g de pizza', NOW() - INTERVAL '9 days'),
('0da28ca6-9e9e-42a8-987c-9c2f1665a64a', 'food', 'hamburguesa', 5.60, '400g hamburguesa', NOW() - INTERVAL '8 days'),
('0da28ca6-9e9e-42a8-987c-9c2f1665a64a', 'food', 'leche', 0.96, '300ml de leche', NOW() - INTERVAL '8 days'),
-- Transporte
('0da28ca6-9e9e-42a8-987c-9c2f1665a64a', 'transport', 'car', 5.76, '30km en auto', NOW() - INTERVAL '10 days'),
('0da28ca6-9e9e-42a8-987c-9c2f1665a64a', 'transport', 'car', 3.84, '20km en auto', NOW() - INTERVAL '9 days'),
('0da28ca6-9e9e-42a8-987c-9c2f1665a64a', 'transport', 'taxi', 4.20, '20km en taxi', NOW() - INTERVAL '8 days');

-- =============================================
-- ACTIVIDADES ESTA SEMANA (últimos 6 días)
-- =============================================

-- Usuario 1 - Esta semana
INSERT INTO activities (user_id, type, name, emissions, details, created_at) VALUES
-- Alimentos
('b1b0e13d-f711-4fea-b22d-96a582c8ddea', 'food', 'cerdo', 2.42, '200g de cerdo', NOW() - INTERVAL '5 days'),
('b1b0e13d-f711-4fea-b22d-96a582c8ddea', 'food', 'queso', 1.35, '100g de queso', NOW() - INTERVAL '5 days'),
('b1b0e13d-f711-4fea-b22d-96a582c8ddea', 'food', 'pizza', 1.50, '300g de pizza', NOW() - INTERVAL '4 days'),
('b1b0e13d-f711-4fea-b22d-96a582c8ddea', 'food', 'leche', 0.64, '200ml de leche', NOW() - INTERVAL '4 days'),
('b1b0e13d-f711-4fea-b22d-96a582c8ddea', 'food', 'salmon', 1.20, '200g de salmon', NOW() - INTERVAL '3 days'),
('b1b0e13d-f711-4fea-b22d-96a582c8ddea', 'food', 'papa', 0.10, '200g de papa', NOW() - INTERVAL '3 days'),
('b1b0e13d-f711-4fea-b22d-96a582c8ddea', 'food', 'huevos', 0.48, '100g de huevos', NOW() - INTERVAL '2 days'),
('b1b0e13d-f711-4fea-b22d-96a582c8ddea', 'food', 'pan', 0.14, '100g de pan', NOW() - INTERVAL '2 days'),
('b1b0e13d-f711-4fea-b22d-96a582c8ddea', 'food', 'aguacate', 0.26, '200g de aguacate', NOW() - INTERVAL '1 day'),
('b1b0e13d-f711-4fea-b22d-96a582c8ddea', 'food', 'cafe', 0.80, '100g de cafe', NOW()),
-- Transporte
('b1b0e13d-f711-4fea-b22d-96a582c8ddea', 'transport', 'car', 2.88, '15km en auto', NOW() - INTERVAL '5 days'),
('b1b0e13d-f711-4fea-b22d-96a582c8ddea', 'transport', 'motor', 1.13, '10km en moto', NOW() - INTERVAL '4 days'),
('b1b0e13d-f711-4fea-b22d-96a582c8ddea', 'transport', 'bus', 1.78, '20km en bus', NOW() - INTERVAL '3 days'),
('b1b0e13d-f711-4fea-b22d-96a582c8ddea', 'transport', 'taxi', 1.05, '5km en taxi', NOW() - INTERVAL '2 days'),
('b1b0e13d-f711-4fea-b22d-96a582c8ddea', 'transport', 'walk', 0.00, '2km caminando', NOW() - INTERVAL '1 day'),
('b1b0e13d-f711-4fea-b22d-96a582c8ddea', 'transport', 'car', 1.92, '10km en auto', NOW());

-- Usuario 2 - Esta semana (sigue eco-friendly)
INSERT INTO activities (user_id, type, name, emissions, details, created_at) VALUES
-- Alimentos
('7e891503-4cb4-4bef-af8d-cc8fd2548c51', 'food', 'avena', 0.16, '100g de avena', NOW() - INTERVAL '5 days'),
('7e891503-4cb4-4bef-af8d-cc8fd2548c51', 'food', 'bananas', 0.14, '200g de bananas', NOW() - INTERVAL '5 days'),
('7e891503-4cb4-4bef-af8d-cc8fd2548c51', 'food', 'garbanzos', 0.16, '200g de garbanzos', NOW() - INTERVAL '4 days'),
('7e891503-4cb4-4bef-af8d-cc8fd2548c51', 'food', 'zanahorias', 0.08, '200g de zanahorias', NOW() - INTERVAL '4 days'),
('7e891503-4cb4-4bef-af8d-cc8fd2548c51', 'food', 'pescado', 1.08, '200g de pescado', NOW() - INTERVAL '3 days'),
('7e891503-4cb4-4bef-af8d-cc8fd2548c51', 'food', 'tomates', 0.28, '200g de tomates', NOW() - INTERVAL '3 days'),
('7e891503-4cb4-4bef-af8d-cc8fd2548c51', 'food', 'yogurt', 0.22, '100g de yogurt', NOW() - INTERVAL '2 days'),
('7e891503-4cb4-4bef-af8d-cc8fd2548c51', 'food', 'manzana', 0.08, '200g de manzana', NOW() - INTERVAL '2 days'),
('7e891503-4cb4-4bef-af8d-cc8fd2548c51', 'food', 'naranjas', 0.10, '200g de naranjas', NOW() - INTERVAL '1 day'),
('7e891503-4cb4-4bef-af8d-cc8fd2548c51', 'food', 'jugo-naranja', 0.22, '200ml de jugo', NOW()),
-- Transporte
('7e891503-4cb4-4bef-af8d-cc8fd2548c51', 'transport', 'cycle', 0.00, '20km en bicicleta', NOW() - INTERVAL '5 days'),
('7e891503-4cb4-4bef-af8d-cc8fd2548c51', 'transport', 'walk', 0.00, '5km caminando', NOW() - INTERVAL '4 days'),
('7e891503-4cb4-4bef-af8d-cc8fd2548c51', 'transport', 'bus', 0.89, '10km en bus', NOW() - INTERVAL '3 days'),
('7e891503-4cb4-4bef-af8d-cc8fd2548c51', 'transport', 'cycle', 0.00, '12km en bicicleta', NOW() - INTERVAL '2 days'),
('7e891503-4cb4-4bef-af8d-cc8fd2548c51', 'transport', 'walk', 0.00, '3km caminando', NOW() - INTERVAL '1 day'),
('7e891503-4cb4-4bef-af8d-cc8fd2548c51', 'transport', 'bus', 0.45, '5km en bus', NOW());

-- Usuario 3 - Esta semana (sigue alto consumo)
INSERT INTO activities (user_id, type, name, emissions, details, created_at) VALUES
-- Alimentos
('0da28ca6-9e9e-42a8-987c-9c2f1665a64a', 'food', 'carne', 5.40, '200g de carne', NOW() - INTERVAL '5 days'),
('0da28ca6-9e9e-42a8-987c-9c2f1665a64a', 'food', 'hamburguesa', 4.20, '300g hamburguesa', NOW() - INTERVAL '5 days'),
('0da28ca6-9e9e-42a8-987c-9c2f1665a64a', 'food', 'pizza', 2.00, '400g de pizza', NOW() - INTERVAL '4 days'),
('0da28ca6-9e9e-42a8-987c-9c2f1665a64a', 'food', 'queso', 2.70, '200g de queso', NOW() - INTERVAL '4 days'),
('0da28ca6-9e9e-42a8-987c-9c2f1665a64a', 'food', 'cerdo', 2.42, '200g de cerdo', NOW() - INTERVAL '3 days'),
('0da28ca6-9e9e-42a8-987c-9c2f1665a64a', 'food', 'salmon', 1.80, '300g de salmon', NOW() - INTERVAL '3 days'),
('0da28ca6-9e9e-42a8-987c-9c2f1665a64a', 'food', 'pollo', 2.07, '300g de pollo', NOW() - INTERVAL '2 days'),
('0da28ca6-9e9e-42a8-987c-9c2f1665a64a', 'food', 'leche', 0.96, '300ml de leche', NOW() - INTERVAL '2 days'),
('0da28ca6-9e9e-42a8-987c-9c2f1665a64a', 'food', 'huevos', 0.96, '200g de huevos', NOW() - INTERVAL '1 day'),
('0da28ca6-9e9e-42a8-987c-9c2f1665a64a', 'food', 'cafe', 1.60, '200g de cafe', NOW()),
-- Transporte
('0da28ca6-9e9e-42a8-987c-9c2f1665a64a', 'transport', 'car', 5.76, '30km en auto', NOW() - INTERVAL '5 days'),
('0da28ca6-9e9e-42a8-987c-9c2f1665a64a', 'transport', 'car', 3.84, '20km en auto', NOW() - INTERVAL '4 days'),
('0da28ca6-9e9e-42a8-987c-9c2f1665a64a', 'transport', 'taxi', 3.15, '15km en taxi', NOW() - INTERVAL '3 days'),
('0da28ca6-9e9e-42a8-987c-9c2f1665a64a', 'transport', 'motor', 2.26, '20km en moto', NOW() - INTERVAL '2 days'),
('0da28ca6-9e9e-42a8-987c-9c2f1665a64a', 'transport', 'car', 2.88, '15km en auto', NOW() - INTERVAL '1 day'),
('0da28ca6-9e9e-42a8-987c-9c2f1665a64a', 'transport', 'taxi', 2.10, '10km en taxi', NOW());

-- =============================================
-- RESUMEN ESPERADO DEL RANKING SEMANAL:
-- 1. Usuario 2: ~3.86 kg CO2 (el más ecológico)
-- 2. Usuario 1: ~16.65 kg CO2 (moderado)
-- 3. Usuario 3: ~45.10 kg CO2 (alto consumo)
-- =============================================
