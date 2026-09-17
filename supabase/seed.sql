insert into public.categories (name, sort_order)
values
  ('Cafés', 1),
  ('Bebidas frías', 2),
  ('Pastelería', 3),
  ('Salado', 4)
on conflict (name) do update
set sort_order = excluded.sort_order;

insert into public.modifiers (name, price_delta)
values
  ('Sin azúcar', 0),
  ('Leche de almendras', 450),
  ('Shot extra', 600),
  ('Descafeinado', 300),
  ('Crema batida', 350)
on conflict (name) do update
set price_delta = excluded.price_delta;

insert into public.products (category_id, name, description, base_price, image_url)
values
  ((select id from public.categories where name = 'Cafés'), 'Espresso', 'Café corto e intenso.', 1800, null),
  ((select id from public.categories where name = 'Cafés'), 'Americano', 'Espresso con agua caliente.', 2200, null),
  ((select id from public.categories where name = 'Cafés'), 'Cappuccino', 'Con espuma de leche cremosa.', 2800, null),
  ((select id from public.categories where name = 'Cafés'), 'Latte', 'Café con mayor proporción de leche.', 3000, null),
  ((select id from public.categories where name = 'Bebidas frías'), 'Cold Brew', 'Extracción en frío por 12 horas.', 3400, null),
  ((select id from public.categories where name = 'Bebidas frías'), 'Limonada', 'Limonada natural con menta.', 2400, null),
  ((select id from public.categories where name = 'Bebidas frías'), 'Tónica de café', 'Café frío con agua tónica.', 3200, null),
  ((select id from public.categories where name = 'Pastelería'), 'Medialuna de manteca', 'Recién horneada.', 1200, null),
  ((select id from public.categories where name = 'Pastelería'), 'Cookie chips', 'Galleta con chips de chocolate.', 1600, null),
  ((select id from public.categories where name = 'Pastelería'), 'Brownie', 'Brownie de chocolate semiamargo.', 2100, null),
  ((select id from public.categories where name = 'Salado'), 'Tostado jamón y queso', 'Pan de campo con jamón y queso.', 3600, null),
  ((select id from public.categories where name = 'Salado'), 'Bagel de salmón', 'Queso crema, rúcula y salmón.', 5200, null)
on conflict do nothing;

insert into public.product_variants (product_id, name, price_delta)
values
  ((select id from public.products where name = 'Espresso'), 'Simple', 0),
  ((select id from public.products where name = 'Espresso'), 'Doble', 700),
  ((select id from public.products where name = 'Americano'), 'Chico', 0),
  ((select id from public.products where name = 'Americano'), 'Grande', 500),
  ((select id from public.products where name = 'Cappuccino'), 'Chico', 0),
  ((select id from public.products where name = 'Cappuccino'), 'Grande', 700),
  ((select id from public.products where name = 'Latte'), 'Chico', 0),
  ((select id from public.products where name = 'Latte'), 'Grande', 700),
  ((select id from public.products where name = 'Cold Brew'), 'Vaso 350ml', 0),
  ((select id from public.products where name = 'Cold Brew'), 'Vaso 500ml', 800)
on conflict (product_id, name) do update
set price_delta = excluded.price_delta;

insert into public.product_modifiers (product_id, modifier_id)
select p.id, m.id
from public.products p
cross join public.modifiers m
where p.name in ('Espresso', 'Americano', 'Cappuccino', 'Latte', 'Cold Brew', 'Tónica de café')
  and m.name in ('Sin azúcar', 'Leche de almendras', 'Shot extra', 'Descafeinado')
on conflict (product_id, modifier_id) do nothing;

insert into public.tables (name, capacity, qr_code)
values
  ('Mesa 1', 2, 'OTON-MESA-01'),
  ('Mesa 2', 2, 'OTON-MESA-02'),
  ('Mesa 3', 4, 'OTON-MESA-03'),
  ('Mesa 4', 4, 'OTON-MESA-04'),
  ('Mesa 5', 6, 'OTON-MESA-05'),
  ('Barra 1', 1, 'OTON-BARRA-01')
on conflict (name) do update
set capacity = excluded.capacity,
    qr_code = excluded.qr_code;
