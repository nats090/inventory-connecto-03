
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://xffinwdhcibvoeebfnlz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmZmlud2RoY2lidm9lZWJmbmx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3MDY0MjIsImV4cCI6MjA1NTI4MjQyMn0.gMem0MZPtowoAjN8xOHkg6ItbNW2jyyV7rhTUuEtbNo";

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Add a check for connection
supabase.from('inventory_items').select('*', { count: 'exact', head: true })
  .then(({ error }) => {
    if (error) {
      console.error('Supabase connection error:', error.message);
    } else {
      console.log('Successfully connected to Supabase');
    }
  });
