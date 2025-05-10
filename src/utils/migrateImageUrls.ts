
import { supabase } from "@/lib/supabase";

/**
 * Migrates image URLs from localStorage to the database
 * This is a one-time migration to be run for existing users
 */
export const migrateImageUrlsFromLocalStorage = async (userId: string) => {
  try {
    // Get all inventory items for the user
    const { data: items, error } = await supabase
      .from('inventory_items')
      .select('id')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    if (!items || items.length === 0) return;
    
    // For each item, check if there's a localStorage entry and update the database
    for (const item of items) {
      const imageUrl = localStorage.getItem(`item_image_${item.id}`);
      if (imageUrl) {
        // Update the database with the image URL from localStorage
        const { error: updateError } = await supabase
          .from('inventory_items')
          .update({ image_url: imageUrl })
          .eq('id', item.id);
          
        if (updateError) {
          console.error(`Failed to migrate image URL for item ${item.id}:`, updateError);
        } else {
          // Remove the item from localStorage after successful migration
          localStorage.removeItem(`item_image_${item.id}`);
          console.log(`Successfully migrated image URL for item ${item.id}`);
        }
      }
    }
    
    console.log('Image URL migration completed');
  } catch (err) {
    console.error('Image URL migration failed:', err);
  }
};
