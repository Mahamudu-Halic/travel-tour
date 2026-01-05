-- Add refund_requests table
create table if not exists public.refund_requests (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid references public.bookings(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  reason text not null,
  status text not null check (status in ('pending', 'approved', 'rejected')) default 'pending',
  admin_notes text,
  refund_amount numeric(10,2) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(booking_id)
);

-- Enable RLS
alter table public.refund_requests enable row level security;

-- Refund request policies
create policy "Users can view their own refund requests"
  on public.refund_requests for select
  using (auth.uid() = user_id);

create policy "Users can create refund requests for their bookings"
  on public.refund_requests for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.bookings
      where bookings.id = booking_id
      and bookings.user_id = auth.uid()
      and bookings.payment_status = 'paid'
    )
  );

create policy "Admins can view all refund requests"
  on public.refund_requests for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.email like '%@besepa.com'
    )
  );

create policy "Admins can update refund requests"
  on public.refund_requests for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.email like '%@besepa.com'
    )
  );

-- Add updated_at trigger
create trigger set_refund_requests_updated_at
  before update on public.refund_requests
  for each row
  execute function public.handle_updated_at();
