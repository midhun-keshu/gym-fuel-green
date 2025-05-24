
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useAdminCheck() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        console.log('Checking admin status...');
        
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('No active session found');
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        console.log('Session found for user:', session.user.email);
        
        // Check user roles
        const { data: userRoles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);
          
        if (error) {
          console.error('Error fetching user roles:', error);
          // Don't show error toast for normal users
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }
        
        console.log('User roles:', userRoles);
        const isUserAdmin = userRoles?.some(ur => ur.role === 'admin') || false;
        console.log('User admin status:', isUserAdmin);
        setIsAdmin(isUserAdmin);
      } catch (error) {
        console.error('Error in admin check:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, []);
  
  return { isAdmin, isLoading };
}
