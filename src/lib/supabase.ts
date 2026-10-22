import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ezidkamrwmtuxsnebguf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6aWRrYW1yd210dXhzbmViZ3VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3Mjg4ODMsImV4cCI6MjEwNjMwNDg4M30.iQhTXV9cnIfy9Akt36BEwf-3Yisy4D6MvOIKYvNybI4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
