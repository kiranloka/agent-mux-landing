# agent-mux-landing

## Waitlist setup

Add these environment variables before starting the server:

Run the SQL in [`supabase/waitlist_signups.sql`](/mnt/ssd2/Documents/Projects/works/agent-mux-landing/supabase/waitlist_signups.sql) in your Supabase project to create the table and RLS policy.

The API route sends the publishable key in the `apikey` header only. Do not use the publishable key as a Bearer token in `Authorization`.

This project was created using `bun init` in bun v1.3.12. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
