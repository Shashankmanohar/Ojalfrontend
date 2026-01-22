import api, { ApiResponse } from '@/lib/api';

export interface OrderItem {
    product: string;
    title: string;
    price: number;
    quantity: number;
    image?: string;
}

export interface ShippingAddress {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

export interface PaymentInfo {
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    paymentStatus: 'pending' | 'completed' | 'failed';
}

export interface Pricing {
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
}

export interface Order {
    _id: string;
    user: string;
    orderItems: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentInfo: PaymentInfo;
    pricing: Pricing;
    orderStatus: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    deliveryDate?: string;
    cancelledAt?: string;
    cancellationReason?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateOrderData {
    items: Array<{ product: string; quantity: number }>;
    shippingAddress: ShippingAddress;
}

export interface CreateOrderResponse {
    order: {
        _id: string;
    };
    razorpayOrderId: string;
    razorpayKeyId: string;
    message: string;
    success?: boolean;
}

export interface VerifyPaymentData {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}

const orderService = {
    // Create new order
    async createOrder(data: CreateOrderData): Promise<CreateOrderResponse> {
        const response = await api.post<CreateOrderResponse>('/api/orders/create', data);
        return response.data;
    },

    // Verify payment after Razorpay success
    async verifyPayment(data: VerifyPaymentData): Promise<ApiResponse> {
        const response = await api.post<ApiResponse>('/api/orders/verify-payment', data);
        return response.data;
    },

    // Get user's orders
    async getUserOrders(): Promise<Order[]> {
        const response = await api.get<{ orders: Order[] }>('/api/orders/my-orders');
        return response.data.orders;
    },

    // Get single order by ID
    async getOrderById(orderId: string): Promise<Order> {
        const response = await api.get<{ order: Order }>(`/api/orders/${orderId}`);
        return response.data.order;
    },

    // Cancel order
    async cancelOrder(orderId: string, reason: string): Promise<ApiResponse> {
        const response = await api.put<ApiResponse>(`/api/orders/${orderId}/cancel`, {
            cancellationReason: reason,
        });
        return response.data;
    },

    // Get all orders (admin only)
    async getAllOrders(): Promise<Order[]> {
        const response = await api.get<{ orders: Order[] }>('/api/orders');
        return response.data.orders;
    },

    // Update order status (admin only)
    async updateOrderStatus(
        orderId: string,
        status: Order['orderStatus'],
        deliveryDate?: string
    ): Promise<ApiResponse> {
        const response = await api.put<ApiResponse>(`/api/orders/${orderId}/status`, {
            orderStatus: status,
            deliveryDate,
        });
        return response.data;
    },
};

export default orderService;
