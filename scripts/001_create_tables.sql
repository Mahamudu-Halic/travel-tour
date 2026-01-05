-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  phone text,
  created_at timestamptz default now()
);

-- Create tours table
create table if not exists public.tours (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  description text not null,
  short_description text,
  destination text not null,
  duration_days integer not null,
  duration_nights integer not null,
  price numeric(10,2) not null,
  max_participants integer not null,
  difficulty_level text check (difficulty_level in ('Easy', 'Moderate', 'Challenging')),
  category text not null check (category in ('Cultural', 'Eco-Tourism', 'Heritage', 'Adventure', 'Wildlife')),
  image_url text,
  gallery_urls text[],
  included_items text[],
  excluded_items text[],
  itinerary jsonb,
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create bookings table
create table if not exists public.bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  tour_id uuid references public.tours(id) on delete restrict not null,
  booking_reference text unique not null,
  number_of_participants integer not null,
  start_date date not null,
  total_amount numeric(10,2) not null,
  payment_status text not null check (payment_status in ('pending', 'paid', 'failed', 'refunded')) default 'pending',
  payment_reference text,
  booking_status text not null check (booking_status in ('pending', 'confirmed', 'cancelled', 'completed')) default 'pending',
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  special_requests text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create reviews table
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  tour_id uuid references public.tours(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  booking_id uuid references public.bookings(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(tour_id, user_id, booking_id)
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.tours enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Tours policies (public read, admin write)
create policy "Anyone can view active tours"
  on public.tours for select
  using (is_active = true);

create policy "Admins can manage tours"
  on public.tours for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.email like '%@besepa.com'
    )
  );

-- Bookings policies
create policy "Users can view their own bookings"
  on public.bookings for select
  using (auth.uid() = user_id);

create policy "Users can create their own bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own bookings"
  on public.bookings for update
  using (auth.uid() = user_id);

create policy "Admins can view all bookings"
  on public.bookings for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.email like '%@besepa.com'
    )
  );

-- Reviews policies
create policy "Anyone can view reviews"
  on public.reviews for select
  using (true);

create policy "Users can create reviews for their bookings"
  on public.reviews for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.bookings
      where bookings.id = booking_id
      and bookings.user_id = auth.uid()
      and bookings.booking_status = 'completed'
    )
  );

create policy "Users can update their own reviews"
  on public.reviews for update
  using (auth.uid() = user_id);

create policy "Users can delete their own reviews"
  on public.reviews for delete
  using (auth.uid() = user_id);

-- Create function to auto-create profile
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Create trigger for new users
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Add updated_at triggers
create trigger set_tours_updated_at
  before update on public.tours
  for each row
  execute function public.handle_updated_at();

create trigger set_bookings_updated_at
  before update on public.bookings
  for each row
  execute function public.handle_updated_at();

create trigger set_reviews_updated_at
  before update on public.reviews
  for each row
  execute function public.handle_updated_at();
