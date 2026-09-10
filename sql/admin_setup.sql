-- SAHAYAK ADMIN CONSOLE / FINAL FIX
-- Run this file LAST in Supabase SQL Editor, after schema.sql, hospital_emergency.sql and hospital_network_v2.sql.
-- It restores the admin permissions that hospital_network_v2 can overwrite.

alter table public.profiles add column if not exists role text not null default 'user';

-- Secure admin check used by the admin login and admin-only policies.
create or replace function public.is_sahayak_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;
revoke execute on function public.is_sahayak_admin() from public, anon;
grant execute on function public.is_sahayak_admin() to authenticated;

-- Hospital applications: applicants can see their own record; admins can see all applications.
alter table public.hospital_applications enable row level security;
drop policy if exists "hospital applications own read" on public.hospital_applications;
create policy "hospital applications own read" on public.hospital_applications
for select to authenticated using (auth.uid() = user_id);

drop policy if exists "hospital applications own insert" on public.hospital_applications;
create policy "hospital applications own insert" on public.hospital_applications
for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "admin applications read" on public.hospital_applications;
create policy "admin applications read" on public.hospital_applications
for select to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Recreate the hospital signup trigger because hospital_network_v2 owns this trigger and can replace it.
create or replace function public.create_hospital_application()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(new.raw_user_meta_data->>'account_type','') = 'hospital' then
    insert into public.hospital_applications (
      user_id, hospital_name, contact_name, phone, registration_number, address, latitude, longitude
    ) values (
      new.id,
      coalesce(new.raw_user_meta_data->>'hospital_name','Hospital application'),
      coalesce(new.raw_user_meta_data->>'full_name','Hospital staff'),
      new.raw_user_meta_data->>'phone',
      new.raw_user_meta_data->>'registration_number',
      new.raw_user_meta_data->>'address',
      nullif(new.raw_user_meta_data->>'latitude','')::double precision,
      nullif(new.raw_user_meta_data->>'longitude','')::double precision
    )
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_hospital_user_created on auth.users;
create trigger on_hospital_user_created
after insert on auth.users
for each row execute procedure public.create_hospital_application();

-- Secure approval/rejection. The function itself checks that the caller is an admin.
create or replace function public.approve_hospital_application(p_application_id uuid, p_hospital_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare applicant uuid;
begin
  if not exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin') then
    raise exception 'Admin access required';
  end if;
  if not exists (select 1 from public.hospitals h where h.id = p_hospital_id) then
    raise exception 'Hospital not found';
  end if;
  select user_id into applicant from public.hospital_applications
  where id = p_application_id and status = 'PENDING';
  if applicant is null then raise exception 'Pending hospital application not found'; end if;
  update public.hospital_applications
  set status = 'APPROVED', hospital_id = p_hospital_id, reviewed_at = now()
  where id = p_application_id;
  update public.profiles set role = 'hospital_staff', hospital_id = p_hospital_id where id = applicant;
end;
$$;
revoke execute on function public.approve_hospital_application(uuid,uuid) from public, anon;
grant execute on function public.approve_hospital_application(uuid,uuid) to authenticated;

create or replace function public.reject_hospital_application(p_application_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin') then
    raise exception 'Admin access required';
  end if;
  update public.hospital_applications
  set status = 'REJECTED', reviewed_at = now()
  where id = p_application_id and status = 'PENDING';
  if not found then raise exception 'Pending hospital application not found'; end if;
end;
$$;
revoke execute on function public.reject_hospital_application(uuid) from public, anon;
grant execute on function public.reject_hospital_application(uuid) to authenticated;

-- Helpful admin read access to connected hospitals.
drop policy if exists "admin hospitals read" on public.hospitals;
create policy "admin hospitals read" on public.hospitals
for select to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin') or auth.role() = 'authenticated');

-- IMPORTANT: keep the admin account as role='admin'. Do not use the same account as hospital_staff.
-- Example:
-- update public.profiles set role='admin', hospital_id=null where id='<YOUR_AUTH_USER_UUID>';
