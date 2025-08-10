import 'react-native-url-polyfill/auto'
import AsyncStorage from "@react-native-async-storage/async-storage";

// Commenting out Supabase client as we'll only use AsyncStorage
/*
const supabase = createClient(
  "http://127.0.0.1:54321", 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0", {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
*/

// Instead, we'll use AsyncStorage directly in the contexts
