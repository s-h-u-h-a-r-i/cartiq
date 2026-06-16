CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  );

  return new;
end;
$function$;

update public.profiles p
set display_name = coalesce(
  u.raw_user_meta_data ->> 'display_name',
  u.raw_user_meta_data ->> 'full_name',
  u.raw_user_meta_data ->> 'name'
)
from auth.users u
where p.id = u.id
  and p.display_name is null;
