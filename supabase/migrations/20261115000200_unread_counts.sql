-- Unread chat messages per project for the signed-in user (RLS applies: security invoker).
create function public.unread_message_counts()
returns table (project_id uuid, unread bigint)
language sql stable security invoker set search_path = public as $$
  select m.project_id, count(*)::bigint
  from public.messages m
  left join public.conversation_reads r on r.project_id = m.project_id and r.user_id = auth.uid()
  where m.author_id is distinct from auth.uid()
    and m.deleted_at is null
    and (r.last_read_at is null or m.created_at > r.last_read_at)
  group by m.project_id
$$;
