import api, { ApiResponse } from '@/lib/api';

export interface Admin {
    _id: string;
    adminName: string;
    email: string;
    role: 'admin' | 'superadmin';
    createdAt: string;
    updatedAt: string;
}

export interface AdminLoginResponse {
    token: string;
    admin: Admin;
    message: string;
}

export interface AdminLoginData {
    email: string;
    password: string;
}

export interface Product {
    _id: string;
    name: string;
    description?: string;
    price: number;
    originalPrice?: number;
    category: string;
    subcategory?: string;
    imageUrl?: string;
    images?: string[];
    inStock: boolean;
    /** Actual stock quantity from backend */
    stock?: number;
    isNew?: boolean;
    isBestseller?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ProductFormData {
    name: string;
    description?: string;
    price: number;
    originalPrice?: number;
    category: string;
    subcategory?: string;
    imageUrl?: string;
    images?: string[];
    /** How many items are in stock */
    stock: number;
    inStock: boolean;
    isNew?: boolean;
    isBestseller?: boolean;
}

const adminService = {
    // Admin Authentication
    async login(data: AdminLoginData): Promise<AdminLoginResponse> {
        const response = await api.post<AdminLoginResponse>('/api/admin/login', data);
        return response.data;
    },

    // Product Management
    async getProducts(): Promise<Product[]> {
        const response = await api.get<{ products: Product[], success: boolean }>('/api/products');
        return response.data.products || [];
    },

    async createProduct(data: ProductFormData, images?: File[]): Promise<Product> {
        const formData = new FormData();

        // Append product data
        formData.append('name', data.name);
        formData.append('title', data.name); // Backend expects 'title'
        if (data.description) formData.append('description', data.description);
        formData.append('price', data.price.toString());
        if (data.originalPrice) formData.append('originalPrice', data.originalPrice.toString());
        formData.append('category', data.category);
        if (data.subcategory) formData.append('subcategory', data.subcategory);

        // Keep backend fields in sync with actual stock quantity
        const stockValue = Math.max(0, data.stock ?? 0);
        const inStock = stockValue > 0;
        formData.append('inStock', inStock.toString());
        formData.append('stock', stockValue.toString());
        if (data.isNew) formData.append('isNew', data.isNew.toString());
        if (data.isBestseller) formData.append('isBestseller', data.isBestseller.toString());

        // Append images
        if (images && images.length > 0) {
            images.forEach((file) => {
                formData.append('images', file);
            });
        }

        const response = await api.post<{ product: Product, success: boolean }>('/api/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.product;
    },

    async updateProduct(id: string, data: Partial<ProductFormData>, images?: File[]): Promise<Product> {
        const formData = new FormData();

        // Append product data
        if (data.name) {
            formData.append('name', data.name);
            formData.append('title', data.name);
        }
        if (data.description) formData.append('description', data.description);
        if (data.price) formData.append('price', data.price.toString());
        if (data.originalPrice) formData.append('originalPrice', data.originalPrice.toString());
        if (data.category) formData.append('category', data.category);
        if (data.subcategory) formData.append('subcategory', data.subcategory);
        if (data.stock !== undefined) {
            const stockValue = Math.max(0, data.stock);
            const inStock = stockValue > 0;
            formData.append('inStock', inStock.toString());
            formData.append('stock', stockValue.toString());
        } else if (data.inStock !== undefined) {
            // Fallback for older calls that only toggle inStock
            const inStock = data.inStock;
            formData.append('inStock', inStock.toString());
        }
        if (data.isNew !== undefined) formData.append('isNew', data.isNew.toString());
        if (data.isBestseller !== undefined) formData.append('isBestseller', data.isBestseller.toString());

        // Append images if provided
        if (images && images.length > 0) {
            images.forEach((file) => {
                formData.append('images', file);
            });
        }

        const response = await api.put<{ product: Product, success: boolean }>(`/api/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.product;
    },

    async deleteProduct(id: string): Promise<void> {
        await api.delete(`/api/products/${id}`);
    },

    // Order Management
    async getOrders(): Promise<any[]> {
        const response = await api.get<{ orders: any[] }>('/api/orders');
        return response.data.orders || [];
    },

    async updateOrderStatus(orderId: string, status: string): Promise<any> {
        const response = await api.put(`/api/orders/${orderId}/status`, { status });
        return response.data;
    },

    // User Management
    async getUsers(): Promise<any[]> {
        const response = await api.get<{ users: any[] }>('/api/users');
        return response.data.users || response.data as any;
    },
};

export default adminService;
