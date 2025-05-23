
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useAdminCheck() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('No active session found');
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        console.log('Session found, checking admin status');
        
        // When testing, you can set all authenticated users as admins
        // Remove this in production or when user roles are properly set up
        if (import.meta.env.DEV) {
          console.log('Development mode: Setting user as admin for testing');
          setIsAdmin(true);
          setIsLoading(false);
          return;
        }
        
        // Check user roles
        const { data: userRoles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);
          
        if (error) {
          console.error('Error fetching user roles:', error);
          toast({
            title: "Error",
            description: "Failed to check admin status.",
            variant: "destructive",
          });
          setIsAdmin(false);
          return;
        }
        
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
  }, [toast]);
  
  return { isAdmin, isLoading };
}
