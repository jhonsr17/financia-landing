-- Actualizar la función crear_usuario_simple para quitar el '+' del teléfono
CREATE OR REPLACE FUNCTION crear_usuario_simple()
RETURNS TRIGGER AS $$
DECLARE
    phone_number text;
BEGIN
  -- Extraer el número de teléfono del metadata
  phone_number := NEW.raw_user_meta_data->>'phone';
  
  -- Si el número empieza con '+', quitarlo
  IF phone_number IS NOT NULL AND phone_number LIKE '+%' THEN
    phone_number := SUBSTRING(phone_number FROM 2);
  END IF;
  
  -- Insertar en tabla usuarios con teléfono sin '+'
  INSERT INTO public.usuarios (id, gmail, nombre, telefono)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'full_name',
    phone_number  -- 👈 ACTUALIZADO: teléfono sin '+'
  )

  
  ON CONFLICT (id) DO UPDATE SET
    gmail = EXCLUDED.gmail,
    nombre = EXCLUDED.nombre,
    telefono = EXCLUDED.telefono;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verificar que el trigger existe
SELECT 
    trigger_name,
    event_manipulation,
    action_statement,
    action_timing
FROM information_schema.triggers
WHERE trigger_name = 'trigger_crear_usuario_simple'
AND event_object_table = 'users'
AND event_object_schema = 'auth';