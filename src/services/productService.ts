import api, { ApiResponse } from '@/lib/api';

export interface ProductImage {
    cloudinaryUrl: string;
    cloudinaryPublicId: string;
    _id?: string;
}

export interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    stock: number;
    images: ProductImage[];
    category: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ProductFormData {
    title: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    isActive?: boolean;
}

const productService = {
    // Get all products
    async getAllProducts(): Promise<Product[]> {
        const response = await api.get<{ products: Product[] }>('/api/products');
        return response.data.products;
    },

    // Get single product by ID
    async getProductById(id: string): Promise<Product> {
        const response = await api.get<{ product: Product }>(`/api/products/${id}`);
        return response.data.product;
    },

    // Add new product (admin only)
    async addProduct(formData: FormData): Promise<Product> {
        const response = await api.post<{ product: Product }>('/api/products/add-product', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.product;
    },

    // Update product (admin only)
    async updateProduct(id: string, formData: FormData): Promise<Product> {
        const response = await api.put<{ product: Product }>(`/api/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.product;
    },

    // Delete product (admin only)
    async deleteProduct(id: string): Promise<ApiResponse> {
        const response = await api.delete<ApiResponse>(`/api/products/${id}`);
        return response.data;
    },
};

export default productService;
