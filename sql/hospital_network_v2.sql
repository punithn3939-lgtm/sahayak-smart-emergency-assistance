-- SAHAYAK HOSPITAL NETWORK V2
-- Run AFTER schema.sql and hospital_emergency.sql.
-- Adds separate hospital onboarding, capacity, availability, recommendations, services and estimates.

alter table public.hospitals add column if not exists emergency_available boolean not null default true;
alter table public.hospitals add column if not exists ambulance_available boolean not null default false;
alter table public.hospitals add column if not exists icu_beds_available integer not null default 0;
alter table public.hospitals add column if not exists general_beds_available integer not null default 0;
alter table public.hospitals add column if not exists specialties text[] not null default '{}';
alter table public.hospitals add column if not exists estimated_charge_low numeric(12,2) not null default 0;
alter table public.hospitals add column if not exists estimated_charge_high numeric(12,2) not null default 0;
alter table public.hospitals add column if not exists rating numeric(2,1) not null default 4.0;
alter table public.hospitals add column if not exists last_capacity_update timestamptz not null default now();
alter table public.hospitals add column if not exists blood_bank_available boolean not null default false;
alter table public.hospitals add column if not exists pharmacy_24x7 boolean not null default false;
alter table public.hospitals add column if not exists diagnostics_24x7 boolean not null default false;
alter table public.hospitals add column if not exists cashless_insurance boolean not null default false;
alter table public.hospitals add column if not exists estimated_wait_minutes integer not null default 30;

create table if not exists public.hospital_applications (
  id uuid primary key default gen_random_uuid(), user_id uuid not null unique references auth.users(id) on delete cascade,
  hospital_name text not null, contact_name text not null, phone text, registration_number text, address text,
  latitude double precision, longitude double precision,
  status text not null default 'PENDING' check (status in ('PENDING','APPROVED','REJECTED')),
  hospital_id uuid references public.hospitals(id) on delete set null, created_at timestamptz not null default now(), reviewed_at timestamptz
);

alter table public.hospital_applications enable row level security;
drop policy if exists "hospital applications own read" on public.hospital_applications;
create policy "hospital applications own read" on public.hospital_applications for select to authenticated using (auth.uid()=user_id);
drop policy if exists "hospital applications own insert" on public.hospital_applications;
create policy "hospital applications own insert" on public.hospital_applications for insert to authenticated with check (auth.uid()=user_id);

drop policy if exists "hospitals authenticated read" on public.hospitals;
create policy "hospitals authenticated read" on public.hospitals for select to authenticated using (true);
drop policy if exists "hospital staff update own hospital" on public.hospitals;
create policy "hospital staff update own hospital" on public.hospitals for update to authenticated
using (exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='hospital_staff' and p.hospital_id=hospitals.id))
with check (exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='hospital_staff' and p.hospital_id=hospitals.id));

create or replace function public.create_hospital_application()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if coalesce(new.raw_user_meta_data->>'account_type','')='hospital' then
    insert into public.hospital_applications (user_id,hospital_name,contact_name,phone,registration_number,address,latitude,longitude)
    values (new.id,coalesce(new.raw_user_meta_data->>'hospital_name','Hospital application'),coalesce(new.raw_user_meta_data->>'full_name','Hospital staff'),new.raw_user_meta_data->>'phone',new.raw_user_meta_data->>'registration_number',new.raw_user_meta_data->>'address',nullif(new.raw_user_meta_data->>'latitude','')::double precision,nullif(new.raw_user_meta_data->>'longitude','')::double precision)
    on conflict (user_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_hospital_user_created on auth.users;
create trigger on_hospital_user_created after insert on auth.users for each row execute procedure public.create_hospital_application();

create or replace function public.approve_hospital_application(p_application_id uuid,p_hospital_id uuid)
returns void language plpgsql security definer set search_path=public as $$
declare applicant uuid;
begin
  select user_id into applicant from public.hospital_applications where id=p_application_id and status='PENDING';
  if applicant is null then raise exception 'Pending hospital application not found'; end if;
  update public.hospital_applications set status='APPROVED',hospital_id=p_hospital_id,reviewed_at=now() where id=p_application_id;
  update public.profiles set role='hospital_staff',hospital_id=p_hospital_id where id=applicant;
end;
$$;

create or replace function public.route_sos_to_hospital()
returns trigger language plpgsql security definer set search_path=public as $$
declare selected_hospital uuid; patient_name_value text; blood_group_value text; allergies_value text; conditions_value text; contact_name_value text; contact_phone_value text;
begin
  select h.id into selected_hospital from public.hospitals h
  where h.available=true and h.emergency_available=true and exists (select 1 from public.profiles hp where hp.role='hospital_staff' and hp.hospital_id=h.id and hp.last_seen_at>now()-interval '2 minutes')
  order by (
    case when new.latitude is null or new.longitude is null then 0 else 1/(1+sqrt(power((h.latitude-new.latitude)*111,2)+power((h.longitude-new.longitude)*111*cos(radians(coalesce(new.latitude,h.latitude))),2))) end
    + case when h.icu_beds_available>0 then .25 else 0 end
    + case when h.ambulance_available then .15 else 0 end
    + case when h.blood_bank_available then .10 else 0 end
    + least(h.rating/10.0,.5)
  ) desc limit 1;
  select p.full_name into patient_name_value from public.profiles p where p.id=new.user_id;
  select m.blood_group,m.allergies,m.medical_conditions into blood_group_value,allergies_value,conditions_value from public.medical_ids m where m.user_id=new.user_id;
  select c.name,c.phone into contact_name_value,contact_phone_value from public.emergency_contacts c where c.user_id=new.user_id order by c.created_at asc limit 1;
  insert into public.emergency_cases (sos_event_id,patient_id,hospital_id,latitude,longitude,patient_name,blood_group,allergies,medical_conditions,emergency_contact_name,emergency_contact_phone)
  values (new.id,new.user_id,selected_hospital,new.latitude,new.longitude,patient_name_value,blood_group_value,allergies_value,conditions_value,contact_name_value,contact_phone_value)
  on conflict (sos_event_id) do nothing;
  return new;
end;
$$;

drop trigger if exists after_sos_route_to_hospital on public.sos_events;
create trigger after_sos_route_to_hospital after insert on public.sos_events for each row execute procedure public.route_sos_to_hospital();

update public.hospitals set emergency_available=true,ambulance_available=true,icu_beds_available=4,general_beds_available=20,specialties=array['Emergency Medicine','Trauma','Cardiology','General Medicine'],estimated_charge_low=1500,estimated_charge_high=15000,rating=4.4,blood_bank_available=true,pharmacy_24x7=true,diagnostics_24x7=true,cashless_insurance=true,estimated_wait_minutes=20,last_capacity_update=now() where name='Sahayak Demo Hospital';

do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='hospitals') then alter publication supabase_realtime add table public.hospitals; end if;
end $$;
