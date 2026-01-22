import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import authService, { User } from '@/services/authService';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is admin
  const checkAdminRole = (userData: User) => {
    setIsAdmin(userData.role === 'admin' || userData.role === 'superadmin');
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          checkAdminRole(userData);

          // Optionally verify token is still valid by fetching profile
          try {
            const freshUserData = await authService.getUserProfile();
            setUser(freshUserData);
            checkAdminRole(freshUserData);
            localStorage.setItem('user', JSON.stringify(freshUserData));
          } catch (error) {
            // Token might be expired, clear auth
            console.error('Token validation failed:', error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setUser(null);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error('Error loading user:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const response = await authService.register({ name, email, password });

      // Store token and user data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      setUser(response.user);
      checkAdminRole(response.user);

      return { error: null };
    } catch (error: any) {
      return {
        error: new Error(error.response?.data?.message || 'Registration failed')
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });

      // Store token and user data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      setUser(response.user);
      checkAdminRole(response.user);

      return { error: null };
    } catch (error: any) {
      return {
        error: new Error(error.response?.data?.message || 'Login failed')
      };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAdmin(false);

    toast({
      title: 'Signed out',
      description: 'You have been successfully signed out.',
    });
  };

  const refreshUser = async () => {
    try {
      const freshUserData = await authService.getUserProfile();
      setUser(freshUserData);
      checkAdminRole(freshUserData);
      localStorage.setItem('user', JSON.stringify(freshUserData));
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        signUp,
        signIn,
        signOut,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
