-- Sahayak Supabase schema
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists public.emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  phone text not null,
  relationship text,
  created_at timestamptz not null default now()
);

create table if not exists public.medical_ids (
  user_id uuid primary key references auth.users(id) on delete cascade,
  blood_group text,
  allergies text,
  medical_conditions text,
  updated_at timestamptz not null default now()
);

create table if not exists public.sos_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now(),
  status text not null default 'activated'
);

alter table public.profiles enable row level security;
alter table public.emergency_contacts enable row level security;
alter table public.medical_ids enable row level security;
alter table public.sos_events enable row level security;

create policy "profiles own select" on public.profiles for select using (auth.uid() = id);
create policy "profiles own insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles own update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "contacts own select" on public.emergency_contacts for select using (auth.uid() = user_id);
create policy "contacts own insert" on public.emergency_contacts for insert with check (auth.uid() = user_id);
create policy "contacts own update" on public.emergency_contacts for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "contacts own delete" on public.emergency_contacts for delete using (auth.uid() = user_id);

create policy "medical own select" on public.medical_ids for select using (auth.uid() = user_id);
create policy "medical own insert" on public.medical_ids for insert with check (auth.uid() = user_id);
create policy "medical own update" on public.medical_ids for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "medical own delete" on public.medical_ids for delete using (auth.uid() = user_id);

create policy "sos own select" on public.sos_events for select using (auth.uid() = user_id);
create policy "sos own insert" on public.sos_events for insert with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name) values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
