import api, { ApiResponse } from '@/lib/api';

export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    addresses?: Address[];
    createdAt: string;
    updatedAt: string;
}

export interface Address {
    _id?: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    isDefault: boolean;
}

export interface LoginResponse {
    token: string;
    user: User;
    message: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface ChangePasswordData {
    oldPassword: string;
    newPassword: string;
}

const authService = {
    // Register new user
    async register(data: RegisterData): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>('/api/users/register', data);
        return response.data;
    },

    // Login user
    async login(data: LoginData): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>('/api/users/login', data);
        return response.data;
    },

    // Get user profile
    async getUserProfile(): Promise<User> {
        const response = await api.get<{ user: User }>('/api/users/profile');
        return response.data.user;
    },

    // Forgot password - Send OTP
    async forgotPassword(email: string): Promise<ApiResponse> {
        const response = await api.post<ApiResponse>('/api/users/forgot-password', { email });
        return response.data;
    },

    // Verify OTP
    async verifyOTP(email: string, otp: string): Promise<ApiResponse> {
        const response = await api.post<ApiResponse>('/api/users/verify-otp', { email, otp });
        return response.data;
    },

    // Reset password with OTP
    async resetPasswordWithOTP(email: string, otp: string, password: string): Promise<ApiResponse> {
        const response = await api.post<ApiResponse>('/api/users/reset-password-otp', {
            email,
            otp,
            password, // Backend expects 'password', not 'newPassword'
        });
        return response.data;
    },

    // Change password (for logged-in users)
    async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
        const response = await api.put<ApiResponse>('/api/users/change-password', {
            currentPassword,
            newPassword,
        });
        return response.data;
    },

    // Get all users (admin only)
    async getAllUsers(): Promise<User[]> {
        const response = await api.get<{ users: User[] }>('/api/users');
        return response.data.users;
    },
};

export default authService;
