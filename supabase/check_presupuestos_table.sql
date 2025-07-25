-- Verificar si la tabla presupuestos existe y su estructura
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'presupuestos'
ORDER BY ordinal_position;

-- Si la tabla no existe, crearla
CREATE TABLE IF NOT EXISTS public.presupuestos (
    id SERIAL PRIMARY KEY,
    usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mes DATE NOT NULL, -- Formato: YYYY-MM-01 (primer día del mes)
    valor NUMERIC(12,2) NOT NULL DEFAULT 0,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Constraint único para evitar múltiples presupuestos por usuario/mes
    UNIQUE(usuario_id, mes)
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_presupuestos_usuario_mes ON public.presupuestos(usuario_id, mes);
CREATE INDEX IF NOT EXISTS idx_presupuestos_mes ON public.presupuestos(mes);

-- Función para actualizar timestamp de actualización
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para auto-actualizar el campo actualizado_en
DROP TRIGGER IF EXISTS update_presupuestos_updated_at ON public.presupuestos;
CREATE TRIGGER update_presupuestos_updated_at
    BEFORE UPDATE ON public.presupuestos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.presupuestos ENABLE ROW LEVEL SECURITY;

-- Política para permitir a los usuarios ver solo sus propios presupuestos
DROP POLICY IF EXISTS "Users can view own budget" ON public.presupuestos;
CREATE POLICY "Users can view own budget" ON public.presupuestos
    FOR SELECT USING (auth.uid() = usuario_id);

-- Política para permitir a los usuarios insertar sus propios presupuestos
DROP POLICY IF EXISTS "Users can insert own budget" ON public.presupuestos;
CREATE POLICY "Users can insert own budget" ON public.presupuestos
    FOR INSERT WITH CHECK (auth.uid() = usuario_id);

-- Política para permitir a los usuarios actualizar sus propios presupuestos
DROP POLICY IF EXISTS "Users can update own budget" ON public.presupuestos;
CREATE POLICY "Users can update own budget" ON public.presupuestos
    FOR UPDATE USING (auth.uid() = usuario_id);

-- Política para permitir a los usuarios eliminar sus propios presupuestos
DROP POLICY IF EXISTS "Users can delete own budget" ON public.presupuestos;
CREATE POLICY "Users can delete own budget" ON public.presupuestos
    FOR DELETE USING (auth.uid() = usuario_id);

-- Verificar las políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'presupuestos';

-- Mostrar algunos datos de ejemplo (si existen)
SELECT usuario_id, mes, valor, creado_en
FROM public.presupuestos
ORDER BY creado_en DESC
LIMIT 5; 