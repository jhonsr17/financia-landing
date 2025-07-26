-- Ver la función existente crear_usuario_simple()
SELECT 
    routine_name,
    routine_definition
FROM information_schema.routines
WHERE routine_name = 'crear_usuario_simple'
AND routine_schema = 'public';

-- También ver el código de la función
\df+ crear_usuario_simple 