-- Team members who aren't full admins (CEO, CTO, VA, customer rep, designers…).
-- Kept in its own migration: a new enum value can't be used in the transaction that adds it.
alter type public.user_role add value if not exists 'staff';
