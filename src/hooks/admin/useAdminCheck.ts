
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
      
      // Check user roles table
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id);
          
      if (rolesError) {
        console.error('❌ Error fetching user roles:', rolesError);
        // If roles table doesn't exist or has issues, don't fail completely
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }
      
      console.log('📋 User roles:', userRoles);
      const hasAdminRole = userRoles?.some(ur => ur.role === 'admin') || false;
      
      console.log('🔑 Final admin status:', hasAdminRole);
      setIsAdmin(hasAdminRole);
      
    } catch (error) {
      console.error('❌ Error in admin check:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  return { isAdmin, isLoading, checkAdminStatus };
}
