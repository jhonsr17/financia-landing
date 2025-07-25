-- Añadir columna de teléfono a la tabla de usuarios
ALTER TABLE auth.users 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Crear índice para búsquedas eficientes por teléfono
CREATE INDEX IF NOT EXISTS idx_users_phone ON auth.users(phone);

-- Crear tabla de perfiles de usuario si no existe (alternativa recomendada)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS en la tabla de perfiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios solo puedan ver y editar su propio perfil
CREATE POLICY "Users can view own profile" 
ON public.user_profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.user_profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON public.user_profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at(); 