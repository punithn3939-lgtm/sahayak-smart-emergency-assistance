-- SAHAYAK ADMIN CONSOLE
-- Run once in Supabase SQL Editor AFTER schema.sql + hospital_emergency.sql + hospital_network_v2.sql.
-- This creates a secure admin role and lets only admins review hospital applications.

alter table public.profiles add column if not exists role text not null default 'user';

-- Secure role check for the admin login. It avoids relying on client-side profile visibility.
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

-- Admins can review every hospital application, while normal users can only see their own.
drop policy if exists "admin applications read" on public.hospital_applications;
create policy "admin applications read" on public.hospital_applications
for select to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create or replace function public.approve_hospital_application(p_application_id uuid, p_hospital_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  applicant uuid;
begin
  if not exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin') then
    raise exception 'Admin access required';
  end if;

  if not exists (select 1 from public.hospitals h where h.id = p_hospital_id) then
    raise exception 'Hospital not found';
  end if;

  select user_id into applicant
  from public.hospital_applications
  where id = p_application_id and status = 'PENDING';

  if applicant is null then
    raise exception 'Pending hospital application not found';
  end if;

  update public.hospital_applications
  set status = 'APPROVED', hospital_id = p_hospital_id, reviewed_at = now()
  where id = p_application_id;

  update public.profiles
  set role = 'hospital_staff', hospital_id = p_hospital_id
  where id = applicant;
end;
$$;

create or replace function public.reject_hospital_application(p_application_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin') then
    raise exception 'Admin access required';
  end if;

  update public.hospital_applications
  set status = 'REJECTED', reviewed_at = now()
  where id = p_application_id and status = 'PENDING';

  if not found then
    raise exception 'Pending hospital application not found';
  end if;
end;
$$;

revoke execute on function public.approve_hospital_application(uuid,uuid) from public, anon;
grant execute on function public.approve_hospital_application(uuid,uuid) to authenticated;
revoke execute on function public.reject_hospital_application(uuid) from public, anon;
grant execute on function public.reject_hospital_application(uuid) to authenticated;

-- IMPORTANT: after creating your admin Auth account, promote it with SQL; never put an admin password in source code.
-- update public.profiles set role='admin', hospital_id=null where id='<YOUR_AUTH_USER_UUID>';
