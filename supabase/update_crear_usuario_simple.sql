-- Actualizar la función crear_usuario_simple para incluir teléfono
CREATE OR REPLACE FUNCTION crear_usuario_simple()
RETURNS TRIGGER AS $$
DECLARE
    user_metadata jsonb;
    full_name text;
    phone text;
    user_email text;
BEGIN
    -- Solo procesar si el email fue confirmado
    IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
        
        -- Obtener metadata del usuario
        user_metadata := NEW.raw_user_meta_data;
        full_name := user_metadata->>'full_name';
        phone := user_metadata->>'phone';
        user_email := NEW.email;
        
        -- Debug logs (opcional - puedes comentar después)
        RAISE NOTICE 'TRIGGER: Procesando confirmación de email para usuario %', NEW.id;
        RAISE NOTICE 'TRIGGER: Metadata = %', user_metadata;
        RAISE NOTICE 'TRIGGER: full_name = %, phone = %, email = %', full_name, phone, user_email;
        
        -- Insertar en tabla usuarios
        INSERT INTO public.usuarios (id, nombre, gmail, telefono)
        VALUES (
            NEW.id,
            COALESCE(full_name, ''),
            COALESCE(user_email, ''),
            phone  -- Puede ser NULL si no se proporcionó
        )
        ON CONFLICT (id) DO UPDATE SET
            nombre = EXCLUDED.nombre,
            gmail = EXCLUDED.gmail,
            telefono = EXCLUDED.telefono;
            
        RAISE NOTICE 'TRIGGER: Usuario insertado/actualizado en tabla usuarios exitosamente';
        
    ELSE
        RAISE NOTICE 'TRIGGER: No es una confirmación de email, saltando...';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verificar que el trigger existe y está activo
SELECT 
    trigger_name,
    event_manipulation,
    action_statement,
    action_timing
FROM information_schema.triggers
WHERE trigger_name = 'trigger_crear_usuario_simple'
AND event_object_table = 'users'
AND event_object_schema = 'auth'; 