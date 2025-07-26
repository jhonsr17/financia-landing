-- 1. Verificar estructura de la tabla usuarios
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'usuarios'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar si RLS está habilitado
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'usuarios'
AND schemaname = 'public';

-- 3. Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'usuarios'
ORDER BY policyname;

-- 4. Ver algunos registros existentes (sin mostrar datos sensibles)
SELECT 
  id,
  nombre,
  CASE 
    WHEN telefono IS NOT NULL THEN 'SÍ TIENE TELÉFONO'
    ELSE 'NO TIENE TELÉFONO'
  END as tiene_telefono,
  LENGTH(telefono) as longitud_telefono
FROM public.usuarios
ORDER BY nombre DESC
LIMIT 10;

-- 5. Contar registros con y sin teléfono
SELECT 
  COUNT(*) as total_usuarios,
  COUNT(telefono) as usuarios_con_telefono,
  COUNT(*) - COUNT(telefono) as usuarios_sin_telefono
FROM public.usuarios; 