-- Sahayak connected hospital emergency network
-- Run this ONCE in Supabase SQL Editor after schema.sql.

create table if not exists public.hospitals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  phone text,
  latitude double precision not null,
  longitude double precision not null,
  available boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists role text not null default 'user';
alter table public.profiles add column if not exists hospital_id uuid references public.hospitals(id) on delete set null;

create table if not exists public.emergency_cases (
  id uuid primary key default gen_random_uuid(),
  case_number text not null unique default ('SHK-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  sos_event_id uuid not null unique references public.sos_events(id) on delete cascade,
  patient_id uuid not null references auth.users(id) on delete cascade,
  hospital_id uuid references public.hospitals(id) on delete set null,
  latitude double precision,
  longitude double precision,
  patient_name text,
  blood_group text,
  allergies text,
  medical_conditions text,
  emergency_contact_name text,
  emergency_contact_phone text,
  status text not null default 'NEW' check (status in ('NEW','ACKNOWLEDGED','ACCEPTED','IN_TREATMENT','CLOSED')),
  created_at timestamptz not null default now(),
  acknowledged_at timestamptz,
  accepted_at timestamptz,
  closed_at timestamptz
);

create index if not exists emergency_cases_hospital_status_idx on public.emergency_cases(hospital_id,status,created_at desc);
create index if not exists emergency_cases_patient_idx on public.emergency_cases(patient_id,created_at desc);

alter table public.hospitals enable row level security;
alter table public.emergency_cases enable row level security;

create policy "hospitals authenticated read" on public.hospitals for select using (auth.role() = 'authenticated');

create policy "cases patient read" on public.emergency_cases for select using (auth.uid() = patient_id);
create policy "cases hospital staff read" on public.emergency_cases for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'hospital_staff' and p.hospital_id = emergency_cases.hospital_id)
);
create policy "cases hospital staff update" on public.emergency_cases for update using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'hospital_staff' and p.hospital_id = emergency_cases.hospital_id)
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'hospital_staff' and p.hospital_id = emergency_cases.hospital_id)
);

-- Automatically create and route a case whenever an authenticated user's SOS is recorded.
create or replace function public.route_sos_to_hospital()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  nearest_hospital uuid;
  patient_name_value text;
  blood_group_value text;
  allergies_value text;
  conditions_value text;
  contact_name_value text;
  contact_phone_value text;
begin
  select h.id into nearest_hospital
  from public.hospitals h
  where h.available = true
  order by case when new.latitude is null or new.longitude is null then 0 else ((h.latitude-new.latitude)^2 + (h.longitude-new.longitude)^2) end
  limit 1;

  select p.full_name into patient_name_value from public.profiles p where p.id = new.user_id;
  select m.blood_group, m.allergies, m.medical_conditions into blood_group_value, allergies_value, conditions_value
  from public.medical_ids m where m.user_id = new.user_id;
  select c.name, c.phone into contact_name_value, contact_phone_value
  from public.emergency_contacts c where c.user_id = new.user_id order by c.created_at asc limit 1;

  insert into public.emergency_cases (
    sos_event_id, patient_id, hospital_id, latitude, longitude, patient_name,
    blood_group, allergies, medical_conditions, emergency_contact_name, emergency_contact_phone
  ) values (
    new.id, new.user_id, nearest_hospital, new.latitude, new.longitude, patient_name_value,
    blood_group_value, allergies_value, conditions_value, contact_name_value, contact_phone_value
  ) on conflict (sos_event_id) do nothing;

  return new;
end;
$$;

drop trigger if exists after_sos_route_to_hospital on public.sos_events;
create trigger after_sos_route_to_hospital
after insert on public.sos_events
for each row execute procedure public.route_sos_to_hospital();

-- Realtime feed for hospital dashboards.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'emergency_cases'
  ) then
    alter publication supabase_realtime add table public.emergency_cases;
  end if;
end $$;

-- Starter hospital for hackathon testing. Replace/edit this record with real partner hospitals later.
insert into public.hospitals (name,address,phone,latitude,longitude,available)
select 'Sahayak Demo Hospital','Mangaluru, Karnataka','112',12.9141,74.8560,true
where not exists (select 1 from public.hospitals where name='Sahayak Demo Hospital');
