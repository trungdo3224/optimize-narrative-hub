import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ielivqlbpmcqpixcbpdc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbGl2cWxicG1jcXBpeGNicGRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyODIyNTAsImV4cCI6MjA1NDg1ODI1MH0.tfaV8AZZh1fFTLfYtX7OOOmcfhAOK3IedOC8mhYvb6U";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
