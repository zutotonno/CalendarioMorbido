-- ============================================================================
-- CalendarioMorbido — migrazione 0004
-- RPC update_event: modifica di un evento già pubblicato da parte di un gestore.
-- events non ha policy di scrittura lato client → SECURITY DEFINER + is_admin().
-- Esegui nel SQL Editor di Supabase.
-- ============================================================================

create or replace function public.update_event(
  p_event_id uuid,
  p_title text,
  p_description text,
  p_start_date date,
  p_end_date date,
  p_region text,
  p_official_url text,
  p_cover_image_key text,
  p_start_comune text,
  p_start_provincia text,
  p_end_comune text,
  p_end_provincia text
)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  update public.events set
    title = p_title,
    description = p_description,
    start_date = p_start_date,
    end_date = p_end_date,
    region = p_region,
    official_url = p_official_url,
    cover_image_key = p_cover_image_key,
    start_comune = p_start_comune,
    start_provincia = p_start_provincia,
    end_comune = p_end_comune,
    end_provincia = p_end_provincia,
    updated_at = now()
  where id = p_event_id;
end;
$$;
