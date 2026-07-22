-- Chạy script này trên Supabase SQL Editor (project đã có bảng orders)

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles (email);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE OR REPLACE FUNCTION public.resolve_user_role(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF lower(trim(user_email)) = 'admin@beco.com' THEN
    RETURN 'admin';
  END IF;
  RETURN 'user';
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, public.resolve_user_role(NEW.email))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND (NEW.role IS DISTINCT FROM OLD.role OR NEW.email IS DISTINCT FROM OLD.email) THEN
    NEW.role := OLD.role;
    NEW.email := OLD.email;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_role ON profiles;
CREATE TRIGGER protect_profile_role
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();

-- Đồng bộ profile cho user đã tồn tại
INSERT INTO profiles (id, email, role)
SELECT id, email, public.resolve_user_role(email)
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET role = public.resolve_user_role(EXCLUDED.email),
    email = EXCLUDED.email;

-- Chỉ admin@beco.com được là admin
UPDATE profiles SET role = 'admin' WHERE lower(email) = 'admin@beco.com';
UPDATE profiles SET role = 'user' WHERE lower(email) <> 'admin@beco.com' AND role = 'admin';

-- Chỉ admin đã xác thực mới được sửa hoặc xóa đơn hàng
DROP POLICY IF EXISTS "Allow anonymous update orders" ON orders;
DROP POLICY IF EXISTS "Allow anonymous delete orders" ON orders;
DROP POLICY IF EXISTS "Allow admin update orders" ON orders;
DROP POLICY IF EXISTS "Allow admin delete orders" ON orders;

CREATE POLICY "Allow admin update orders"
ON orders FOR UPDATE
USING (lower(auth.jwt() ->> 'email') = 'admin@beco.com')
WITH CHECK (lower(auth.jwt() ->> 'email') = 'admin@beco.com');

CREATE POLICY "Allow admin delete orders"
ON orders FOR DELETE
USING (lower(auth.jwt() ->> 'email') = 'admin@beco.com');
