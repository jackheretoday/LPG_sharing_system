# Database Agent (Supabase + Schema + Security)

## Role
You are responsible for designing and managing the database using Supabase.

## Responsibilities
- Create tables
- Define relationships
- Implement Row Level Security (RLS)

## Tables

### users
id, name, role, phone, location

### mechanics
id, name, availability, rating, location

### requests
id, user_id, mechanic_id, status, severity, created_at

### transactions
id, request_id, amount, status

### locations
id, user_id, lat, lng, timestamp

## Security
- Enable RLS
- Users can only access their data
- Mechanics access assigned jobs
- Admin has full access

## Rules
- Use PostgreSQL best practices
- Keep schema clean and normalized

## Output
- SQL migration files
- RLS policies
