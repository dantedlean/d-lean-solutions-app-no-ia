DO $$
DECLARE
  vendedor_id uuid;
  engenharia_id uuid;
  admin_id uuid;
BEGIN
  -- Admin User
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dante@dlean.com.br') THEN
    admin_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role, aud, confirmation_token, recovery_token, email_change_token_new, email_change, email_change_token_current, phone_change, phone_change_token, reauthentication_token)
    VALUES (admin_id, '00000000-0000-0000-0000-000000000000', 'dante@dlean.com.br', crypt('Skip@Pass', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider": "email", "providers": ["email"]}', '{"role": "admin", "name": "Administrador"}', false, 'authenticated', 'authenticated', '', '', '', '', '', '', '', '');
  END IF;

  -- Vendedor User
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'vendedor@dlean.com.br') THEN
    vendedor_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role, aud, confirmation_token, recovery_token, email_change_token_new, email_change, email_change_token_current, phone_change, phone_change_token, reauthentication_token)
    VALUES (vendedor_id, '00000000-0000-0000-0000-000000000000', 'vendedor@dlean.com.br', crypt('Skip@Pass', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider": "email", "providers": ["email"]}', '{"role": "vendedor", "name": "Vendedor"}', false, 'authenticated', 'authenticated', '', '', '', '', '', '', '', '');
  END IF;

  -- Engenharia User
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'engenharia@dlean.com.br') THEN
    engenharia_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role, aud, confirmation_token, recovery_token, email_change_token_new, email_change, email_change_token_current, phone_change, phone_change_token, reauthentication_token)
    VALUES (engenharia_id, '00000000-0000-0000-0000-000000000000', 'engenharia@dlean.com.br', crypt('Skip@Pass', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider": "email", "providers": ["email"]}', '{"role": "engenharia", "name": "Engenharia de Vendas"}', false, 'authenticated', 'authenticated', '', '', '', '', '', '', '', '');
  END IF;
END $$;
