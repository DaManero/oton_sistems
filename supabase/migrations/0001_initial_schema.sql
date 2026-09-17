create extension if not exists "pgcrypto";

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('owner', 'manager', 'barista', 'waiter');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_type') THEN
    CREATE TYPE public.order_type AS ENUM ('dine_in', 'takeaway', 'delivery');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE public.order_status AS ENUM ('pending', 'in_progress', 'ready', 'delivered', 'cancelled');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
    CREATE TYPE public.payment_method AS ENUM ('cash', 'card', 'qr', 'transfer');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  role public.user_role NOT NULL DEFAULT 'waiter',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);
COMMENT ON TABLE public.profiles IS 'Perfiles de usuarios del sistema vinculados a auth.users.';

CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);
COMMENT ON TABLE public.categories IS 'Categorías del menú (cafés, pastelería, etc.).';

CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.categories(id),
  name text NOT NULL,
  description text,
  base_price numeric(10,2) NOT NULL CHECK (base_price >= 0),
  image_url text,
  available boolean NOT NULL DEFAULT true,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);
COMMENT ON TABLE public.products IS 'Productos comercializables del menú.';

CREATE TABLE IF NOT EXISTS public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name text NOT NULL,
  price_delta numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE(product_id, name)
);
COMMENT ON TABLE public.product_variants IS 'Variantes de productos (ej: tamaño, leche, etc.).';

CREATE TABLE IF NOT EXISTS public.modifiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  price_delta numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);
COMMENT ON TABLE public.modifiers IS 'Modificadores opcionales aplicables a productos.';

CREATE TABLE IF NOT EXISTS public.product_modifiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  modifier_id uuid NOT NULL REFERENCES public.modifiers(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE(product_id, modifier_id)
);
COMMENT ON TABLE public.product_modifiers IS 'Relación N:N entre productos y modificadores.';

CREATE TABLE IF NOT EXISTS public.tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  capacity integer NOT NULL DEFAULT 2 CHECK (capacity > 0),
  qr_code text UNIQUE,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);
COMMENT ON TABLE public.tables IS 'Mesas físicas de la cafetería.';

CREATE TABLE IF NOT EXISTS public.cash_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opened_by uuid NOT NULL REFERENCES public.profiles(id),
  closed_by uuid REFERENCES public.profiles(id),
  opened_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  closed_at timestamptz,
  opening_amount numeric(10,2) NOT NULL DEFAULT 0,
  closing_amount numeric(10,2),
  expected_amount numeric(10,2),
  notes text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);
COMMENT ON TABLE public.cash_sessions IS 'Turnos de caja con apertura, cierre y arqueo.';

CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE DEFAULT ('ORD-' || lpad(nextval('public.order_number_seq')::text, 6, '0')),
  table_id uuid REFERENCES public.tables(id),
  type public.order_type NOT NULL DEFAULT 'dine_in',
  status public.order_status NOT NULL DEFAULT 'pending',
  created_by uuid NOT NULL REFERENCES public.profiles(id),
  cash_session_id uuid NOT NULL REFERENCES public.cash_sessions(id),
  customer_name text,
  notes text,
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  discount numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);
COMMENT ON TABLE public.orders IS 'Pedidos de mesa, para llevar o delivery.';

CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id),
  variant_id uuid REFERENCES public.product_variants(id),
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price numeric(10,2) NOT NULL CHECK (unit_price >= 0),
  notes text,
  status public.order_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);
COMMENT ON TABLE public.order_items IS 'Items individuales de cada pedido.';

CREATE TABLE IF NOT EXISTS public.order_item_modifiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id uuid NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
  modifier_id uuid NOT NULL REFERENCES public.modifiers(id),
  price_delta numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);
COMMENT ON TABLE public.order_item_modifiers IS 'Modificadores elegidos por item de pedido.';

CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  method public.payment_method NOT NULL,
  amount numeric(10,2) NOT NULL CHECK (amount >= 0),
  paid_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);
COMMENT ON TABLE public.payments IS 'Pagos registrados por pedido.';

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$;

DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'profiles',
      'categories',
      'products',
      'product_variants',
      'modifiers',
      'product_modifiers',
      'tables',
      'cash_sessions',
      'orders',
      'order_items',
      'order_item_modifiers',
      'payments'
    ])
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%I_updated_at ON public.%I', tbl, tbl);
    EXECUTE format('CREATE TRIGGER trg_%I_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', tbl, tbl);
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.role
  FROM public.profiles p
  WHERE p.id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.has_role(allowed_roles public.user_role[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce(public.current_user_role() = ANY (allowed_roles), false);
$$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_item_modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'profiles',
      'categories',
      'products',
      'product_variants',
      'modifiers',
      'product_modifiers',
      'tables',
      'cash_sessions',
      'orders',
      'order_items',
      'order_item_modifiers',
      'payments'
    ])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I_authenticated_read ON public.%I', tbl, tbl);
    EXECUTE format('CREATE POLICY %I_authenticated_read ON public.%I FOR SELECT USING (auth.role() = ''authenticated'')', tbl, tbl);
  END LOOP;
END $$;

DROP POLICY IF EXISTS profiles_insert_self_or_manager ON public.profiles;
CREATE POLICY profiles_insert_self_or_manager ON public.profiles
FOR INSERT
WITH CHECK (
  auth.uid() = id
  OR public.has_role(ARRAY['owner', 'manager']::public.user_role[])
);

DROP POLICY IF EXISTS profiles_update_self_or_manager ON public.profiles;
CREATE POLICY profiles_update_self_or_manager ON public.profiles
FOR UPDATE
USING (
  auth.uid() = id
  OR public.has_role(ARRAY['owner', 'manager']::public.user_role[])
)
WITH CHECK (
  auth.uid() = id
  OR public.has_role(ARRAY['owner', 'manager']::public.user_role[])
);

DROP POLICY IF EXISTS profiles_delete_manager_only ON public.profiles;
CREATE POLICY profiles_delete_manager_only ON public.profiles
FOR DELETE
USING (public.has_role(ARRAY['owner', 'manager']::public.user_role[]));

DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'categories',
      'products',
      'product_variants',
      'modifiers',
      'product_modifiers',
      'tables'
    ])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I_admin_write ON public.%I', tbl, tbl);
    EXECUTE format('CREATE POLICY %I_admin_write ON public.%I FOR ALL USING (public.has_role(ARRAY[''owner'', ''manager'']::public.user_role[])) WITH CHECK (public.has_role(ARRAY[''owner'', ''manager'']::public.user_role[]))', tbl, tbl);
  END LOOP;
END $$;

DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'cash_sessions',
      'orders',
      'order_items',
      'order_item_modifiers',
      'payments'
    ])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I_staff_write ON public.%I', tbl, tbl);
    EXECUTE format('CREATE POLICY %I_staff_write ON public.%I FOR ALL USING (public.has_role(ARRAY[''owner'', ''manager'', ''barista'', ''waiter'']::public.user_role[])) WITH CHECK (public.has_role(ARRAY[''owner'', ''manager'', ''barista'', ''waiter'']::public.user_role[]))', tbl, tbl);
  END LOOP;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'orders'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'order_items'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;
    END IF;
  END IF;
END $$;
