import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL ||
  "https://xnrlkxvbqkdjoecfesdd.supabase.co";
const supabaseAnonKey =
  process.env.REACT_APP_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhucmxreHZicWtkam9lY2Zlc2RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzODAwNTMsImV4cCI6MjA3NTk1NjA1M30.0xmuCgopC2vGDsAKB-zFzeuFBKXQQLh509UluyVG0y0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
