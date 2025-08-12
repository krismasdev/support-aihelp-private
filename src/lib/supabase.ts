import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://nuhzhgjqticeeijkrzhp.supabase.co';
const supabaseKey = 'sb_publishable_HtihQo6SAqlr3Xqj5YKFOA_6X_4msUV';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };