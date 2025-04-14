import { createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

const supabaseUrl = environment.supabaseUrl
const supabaseAnonKey = environment.supabaseAnonKey;  

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
