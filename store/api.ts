import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface QueryParams {
    category?: string;
    search?: string;
    featured?: boolean;
    newArrival?: boolean;
    bestSeller?: boolean;
    limit?: number;
}

function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem('auth-storage');
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed?.state?.token ?? null;
    } catch {
        return null;
    }
}

function buildQuery(params?: QueryParams | Record<string, unknown>): string {
    if (!params) return '';
    const search = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        search.set(key, String(value));
    });

    const queryString = search.toString();
    return queryString ? `?${queryString}` : '';
}

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        prepareHeaders: (headers) => {
            const token = getToken();
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Products', 'Categories', 'Orders', 'Users', 'Banners', 'Testimonials', 'Newsletter', 'Chatbot', 'WhatsApp', 'Discount'],
    endpoints: (builder) => ({
        getProducts: builder.query<{ products: any[] }, QueryParams | void>({
            query: (params) => `/products${buildQuery(params ?? {})}`,
            providesTags: ['Products'],
        }),
        getProductBySlug: builder.query<any, string>({
            query: (slug) => `/products/slug/${slug}`,
            providesTags: ['Products'],
        }),
        getProductById: builder.query<any, string>({
            query: (id) => `/products/${id}`,
            providesTags: ['Products'],
        }),
        getCategories: builder.query<any[], void>({
            query: () => '/categories',
            providesTags: ['Categories'],
        }),
        getTestimonials: builder.query<any[], void>({
            query: () => '/testimonials',
            providesTags: ['Testimonials'],
        }),
        getBanners: builder.query<any[], void>({
            query: () => '/banners',
            providesTags: ['Banners'],
        }),
        getOrders: builder.query<any[], void>({
            query: () => '/orders',
            providesTags: ['Orders'],
        }),
        getOrderById: builder.query<any, string>({
            query: (id) => `/orders/${id}`,
            providesTags: ['Orders'],
        }),
        getUsers: builder.query<any[], void>({
            query: () => '/users',
            providesTags: ['Users'],
        }),
        login: builder.mutation<any, { email: string; password: string }>({
            query: (body) => ({ url: '/auth/login', method: 'POST', body }),
        }),
        register: builder.mutation<any, { name: string; email: string; password: string }>({
            query: (body) => ({ url: '/auth/register', method: 'POST', body }),
        }),
        validateDiscount: builder.mutation<any, { code: string; subtotal: number }>({
            query: (body) => ({ url: '/discount/validate', method: 'POST', body }),
            invalidatesTags: ['Discount'],
        }),
        createOrder: builder.mutation<any, any>({
            query: (body) => ({ url: '/orders', method: 'POST', body }),
            invalidatesTags: ['Orders'],
        }),
        newsletter: builder.mutation<any, { email: string }>({
            query: (body) => ({ url: '/newsletter', method: 'POST', body }),
            invalidatesTags: ['Newsletter'],
        }),
        chatbot: builder.mutation<any, { message: string; history: any[] }>({
            query: (body) => ({ url: '/chatbot', method: 'POST', body }),
        }),
        getWhatsAppQr: builder.query<any, void>({
            query: () => '/whatsapp/qr',
            providesTags: ['WhatsApp'],
        }),
        uploadImage: builder.mutation<any, FormData>({
            query: (formData) => ({ url: '/upload', method: 'POST', body: formData }),
        }),
        createProduct: builder.mutation<any, any>({
            query: (body) => ({ url: '/products/create', method: 'POST', body }),
            invalidatesTags: ['Products'],
        }),
        updateProduct: builder.mutation<any, { id: string; body: any }>({
            query: ({ id, body }) => ({ url: `/products/${id}`, method: 'PATCH', body }),
            invalidatesTags: ['Products'],
        }),
        deleteProduct: builder.mutation<any, string>({
            query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Products'],
        }),
        createUser: builder.mutation<any, any>({
            query: (body) => ({ url: '/users', method: 'POST', body }),
            invalidatesTags: ['Users'],
        }),
        updateUser: builder.mutation<any, { id: string; body: any }>({
            query: ({ id, body }) => ({ url: `/users/${id}`, method: 'PATCH', body }),
            invalidatesTags: ['Users'],
        }),
        deleteUser: builder.mutation<any, string>({
            query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
            invalidatesTags: ['Users'],
        }),
        updateOrder: builder.mutation<any, { id: string; body: any }>({
            query: ({ id, body }) => ({ url: `/orders/${id}`, method: 'PATCH', body }),
            invalidatesTags: ['Orders'],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductBySlugQuery,
    useGetProductByIdQuery,
    useGetCategoriesQuery,
    useGetTestimonialsQuery,
    useGetBannersQuery,
    useGetOrdersQuery,
    useGetOrderByIdQuery,
    useGetUsersQuery,
    useLoginMutation,
    useRegisterMutation,
    useValidateDiscountMutation,
    useCreateOrderMutation,
    useNewsletterMutation,
    useChatbotMutation,
    useGetWhatsAppQrQuery,
    useUploadImageMutation,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useUpdateOrderMutation,
} = api;
