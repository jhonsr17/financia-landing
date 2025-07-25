-- Verificar que la tabla usuarios existe y tiene las columnas correctas
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'usuarios' AND table_schema = 'public';

-- Verificar RLS en la tabla usuarios
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'usuarios';

-- Si RLS no está habilitado, habilitarlo
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Política para permitir insertar nuevos usuarios (durante el registro)
CREATE POLICY IF NOT EXISTS "Allow insert for authenticated users" 
ON public.usuarios 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Política para que los usuarios puedan ver solo su propio registro
CREATE POLICY IF NOT EXISTS "Users can view own record" 
ON public.usuarios 
FOR SELECT 
USING (auth.uid() = id);

-- Política para que los usuarios puedan actualizar solo su propio registro
CREATE POLICY IF NOT EXISTS "Users can update own record" 
ON public.usuarios 
FOR UPDATE 
USING (auth.uid() = id);

-- Verificar políticas existentes
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies 
WHERE tablename = 'usuarios';

-- Grant de permisos necesarios
GRANT INSERT, SELECT, UPDATE ON public.usuarios TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated; 