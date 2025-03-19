// This script can be used to check if your Supabase setup is working correctly

// Replace these with your actual Supabase URL and anon key
const SUPABASE_URL = 'https://smwqigzuvovkfuykepcl.supabase.co';
const SUPABASE_ANON_KEY = 'your_anon_key_here';

// This function would normally be imported from the Supabase client
// You can paste this into your browser console to test your setup
async function checkSupabaseSetup() {
  try {
    // Initialize a basic Supabase client
    const supabase = {
      from: (table) => ({
        select: (query) => fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${query}`, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        }).then(res => res.json())
      }),
      auth: {
        signUp: (credentials) => fetch(`${SUPABASE_URL}/auth/v1/signup`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        }).then(res => {
          if (!res.ok) {
            return res.json().then(err => {
              throw new Error(`Error ${res.status}: ${JSON.stringify(err)}`);
            });
          }
          return res.json();
        })
      }
    };

    // 1. Check if we can access the training_programs table
    console.log('Checking training_programs table...');
    const programs = await supabase.from('training_programs').select('*');
    console.log('Programs found:', programs);

    // 2. Test a simple signup with a random email (will fail if email exists)
    const testEmail = `test_${Math.random().toString(36).substring(2, 15)}@example.com`;
    console.log(`Testing signup API with email: ${testEmail}...`);
    try {
      const signupResult = await supabase.auth.signUp({
        email: testEmail,
        password: 'testPassword123!'
      });
      console.log('Signup API test result:', signupResult);
    } catch (error) {
      console.error('Signup API test failed:', error.message);
    }

    console.log('✅ Setup check completed');
  } catch (error) {
    console.error('❌ Setup check failed:', error);
  }
}

// Call the function to test the setup
checkSupabaseSetup();
