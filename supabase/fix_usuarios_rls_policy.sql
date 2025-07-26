-- 1. Ver las políticas actuales
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'usuarios'
ORDER BY policyname;

-- 2. Eliminar la política problemática si existe
DROP POLICY IF EXISTS "insertar mi perfil" ON public.usuarios;

-- 3. Crear nueva política que permita insertar durante el registro
CREATE POLICY "usuarios_insert_policy" ON public.usuarios
    FOR INSERT 
    WITH CHECK (
        -- Permitir insertar cuando el usuario se está registrando (auth.uid() puede ser null)
        -- O cuando el ID coincide con el usuario autenticado
        auth.uid() IS NULL OR auth.uid() = id
    );

-- 4. Política para SELECT (ver solo sus propios datos)
DROP POLICY IF EXISTS "usuarios_select_policy" ON public.usuarios;
CREATE POLICY "usuarios_select_policy" ON public.usuarios
    FOR SELECT USING (auth.uid() = id);

-- 5. Política para UPDATE (actualizar solo sus propios datos)
DROP POLICY IF EXISTS "usuarios_update_policy" ON public.usuarios;
CREATE POLICY "usuarios_update_policy" ON public.usuarios
    FOR UPDATE USING (auth.uid() = id);

-- 6. Política para DELETE (eliminar solo sus propios datos)
DROP POLICY IF EXISTS "usuarios_delete_policy" ON public.usuarios;
CREATE POLICY "usuarios_delete_policy" ON public.usuarios
    FOR DELETE USING (auth.uid() = id);

-- 7. Verificar que RLS esté habilitado
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- 8. Ver las nuevas políticas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'usuarios'
ORDER BY policyname; 