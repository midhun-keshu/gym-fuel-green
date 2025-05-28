
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useAdminCheck() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    checkAdminStatus();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        checkAdminStatus();
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  
  const checkAdminStatus = async () => {
    try {
      console.log('🔍 Checking admin status...');
      setIsLoading(true);
      
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Session error:', sessionError);
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }
      
      if (!session || !session.user) {
        console.log('❌ No active session found');
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      console.log('✅ Session found for user:', session.user.email);
      
      // Check if this is the admin user by email (hardcoded admin)
      if (session.user.email === 'admin@gymfood.com') {
        console.log('✅ Admin user identified by email');
        setIsAdmin(true);
        setIsLoading(false);
        return;
      }
      
      // Check admin role using the is_admin function (which exists in the database)
      try {
        const { data: isAdminResult, error: roleError } = await supabase
          .rpc('is_admin', { uid: session.user.id });
        
        if (!roleError && isAdminResult === true) {
          console.log('✅ Admin role confirmed via database');
          setIsAdmin(true);
        } else {
          console.log('❌ User is not admin');
          setIsAdmin(false);
        }
      } catch (error) {
        console.log('⚠️ Role check failed, falling back to email check');
        setIsAdmin(false);
      }
      
    } catch (error) {
      console.error('❌ Error in admin check:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  return { isAdmin, isLoading, checkAdminStatus };
}
