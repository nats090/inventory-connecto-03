
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://xffinwdhcibvoeebfnlz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmZmlud2RoY2lidm9lZWJmbmx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3MDY0MjIsImV4cCI6MjA1NTI4MjQyMn0.gMem0MZPtowoAjN8xOHkg6ItbNW2jyyV7rhTUuEtbNo";

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Check and add image_url column if it doesn't exist
const checkAndAddImageUrlColumn = async () => {
  try {
    // First check if the column exists
    const { error: checkError } = await supabase.rpc('test_image_url_column');

    // If error, the column might not exist - try to add it
    if (checkError) {
      console.log('Adding image_url column to inventory_items table...');
      
      // Add the column using SQL
      const { error: addError } = await supabase.rpc('add_image_url_column');
      
      if (addError) {
        console.error('Failed to add image_url column:', addError);
      } else {
        console.log('Successfully added image_url column');
      }
    }
  } catch (err) {
    console.error('Error checking/adding image_url column:', err);
  }
};

// Add a check for connection
supabase.from('inventory_items').select('*', { count: 'exact', head: true })
  .then(({ error }) => {
    if (error) {
      console.error('Supabase connection error:', error.message);
    } else {
      console.log('Successfully connected to Supabase');
      // Run the column check after successful connection
      checkAndAddImageUrlColumn();
    }
  });
