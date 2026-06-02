-- Enable Row Level Security on all tables
-- Prisma uses the postgres superuser role which bypasses RLS, so the app is unaffected.
-- This blocks Supabase's auto-generated REST API (PostgREST) from exposing the tables publicly.

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TimeSlot" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Reservation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GalleryImage" ENABLE ROW LEVEL SECURITY;

-- No permissive policies = deny-all for anon/authenticated roles by default.
-- All data access goes through Next.js API routes (Prisma server-side only).
