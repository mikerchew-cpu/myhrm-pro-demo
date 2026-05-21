create table if not exists employees (
  id bigserial primary key,
  employee_id text unique not null,
  name text not null,
  role text not null,
  department text not null default 'HR',
  employment_type text not null default 'Permanent',
  status text not null default 'Active',
  created_at timestamptz not null default now()
);

create table if not exists admin_staff (
  id bigserial primary key,
  name text not null,
  email text unique not null,
  dept text not null default 'HR',
  level text not null default 'Executive',
  view_scope text not null default 'Own records',
  app_function text not null default 'Employee + Leave',
  approval_right text not null default 'None',
  created_at timestamptz not null default now()
);
