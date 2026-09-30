import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://vdbtwcbydirqwrogwkkz.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkYnR3Y2J5ZGlycXdyb2d3a2t6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4MDIyMDgsImV4cCI6MjEwNjM3ODIwOH0.FSPNlvm0dRm24DNmHB_i-1YvkhCJGsLq2Bn2VrNrX00';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
