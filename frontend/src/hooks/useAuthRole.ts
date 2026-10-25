'use client';
import { isAuthenticatedWithRole } from '@/utils/auth';
import { useState, useEffect } from 'react';

export function useAuthRole(role:string) {
  const [authState, setAuthState] = useState({
    hasPermission: false,
    isLoading: true,
  });

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const hasPermission = await isAuthenticatedWithRole(role);
        setAuthState({
          hasPermission,
          isLoading: false,
        });
      } catch (error) {
        console.error(error);
        setAuthState({
          hasPermission: false,
          isLoading: false,
        });
      }
    };

    checkAuthStatus();
  }, [role]);

  return authState;
}