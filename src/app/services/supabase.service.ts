import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hxginrntgyrpyyxugkui.supabase.co';  
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4Z2lucm50Z3lycHl5eHVna3VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0NzUyNDIsImV4cCI6MjA1NTA1MTI0Mn0.BAdaF8kjp4qGLYwQIiC4U1PofVYbwNdgNfbWc0nPxOY';  

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
