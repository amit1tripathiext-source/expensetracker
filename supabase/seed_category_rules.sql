-- Replace this UUID with the auth.users.id for the user you want to seed.
with target_user as (
  select '00000000-0000-0000-0000-000000000000'::uuid as user_id
)
insert into exptrack.category_rules (user_id, keyword, category)
select target_user.user_id, seed.keyword, seed.category
from target_user
cross join (
  values
    ('uber', 'Transport'),
    ('lyft', 'Transport'),
    ('metro', 'Transport'),
    ('swiggy', 'Food'),
    ('zomato', 'Food'),
    ('starbucks', 'Food'),
    ('netflix', 'Entertainment'),
    ('spotify', 'Entertainment'),
    ('aws', 'Software'),
    ('figma', 'Software')
) as seed(keyword, category)
on conflict (user_id, keyword) do update
set category = excluded.category;
