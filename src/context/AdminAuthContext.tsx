import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import adminService, { Admin } from '@/services/adminService';
import { toast } from '@/hooks/use-toast';

interface AdminAuthContextType {
    admin: Admin | null;
    loading: boolean;
    adminLogin: (email: string, password: string) => Promise<{ error: Error | null }>;
    adminLogout: () => void;
    isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [loading, setLoading] = useState(true);

    // Load admin from localStorage on mount
    useEffect(() => {
        const loadAdmin = () => {
            const token = localStorage.getItem('adminToken');
            const storedAdmin = localStorage.getItem('admin');

            if (token && storedAdmin) {
                try {
                    const adminData = JSON.parse(storedAdmin);
                    setAdmin(adminData);
                } catch (error) {
                    console.error('Error loading admin:', error);
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('admin');
                }
            }
            setLoading(false);
        };

        loadAdmin();
    }, []);

    const adminLogin = async (email: string, password: string) => {
        try {
            const response = await adminService.login({ email, password });

            // Validate response structure
            if (!response || !response.token || !response.admin) {
                console.error('Invalid login response:', response);
                return {
                    error: new Error('Invalid response from server')
                };
            }

            // Store token and admin data
            localStorage.setItem('adminToken', response.token);
            localStorage.setItem('admin', JSON.stringify(response.admin));

            setAdmin(response.admin);

            return { error: null };
        } catch (error: any) {
            console.error('Admin login error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Admin login failed';
            return {
                error: new Error(errorMessage)
            };
        }
    };

    const adminLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        setAdmin(null);

        toast({
            title: 'Logged out',
            description: 'You have been successfully logged out.',
        });
    };

    return (
        <AdminAuthContext.Provider
            value={{
                admin,
                loading,
                adminLogin,
                adminLogout,
                isAuthenticated: !!admin
            }}
        >
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    const context = useContext(AdminAuthContext);
    if (context === undefined) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
}
