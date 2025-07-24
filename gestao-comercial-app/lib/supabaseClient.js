import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kedoiksxqbkqogtiugvz.supabase.co/";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlZG9pa3N4cWJrcW9ndGl1Z3Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNjM2NTcsImV4cCI6MjA2ODgzOTY1N30.IN64BDx916iCGwZ2kntEPWkmWXySgYH8cnj88Y-AlNg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
