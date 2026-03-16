'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/services/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: { _id: string; name: string; slug: string } | null;
  sizes: { size: string; quantity: number }[];
  colors: { image: string; quantity: number }[];
  stock: number;
  images: string[];
  videoUrl?: string;
  tags: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

const SIZES = ['S', 'M', 'L', 'XL'];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    images: [] as string[],
    videoUrl: '',
    sizes: SIZES.map((s) => ({ size: s, quantity: 10 })),
    colors: [] as { image: string; quantity: number }[],
    tags: '',
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    isActive: true,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await api.get<{ products: Product[] }>('/products');
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await api.get<Category[]>('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags?.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      description: '',
      price: '',
      discountPrice: '',
      category: '',
      images: [],
      videoUrl: '',
      sizes: SIZES.map((s) => ({ size: s, quantity: 10 })),
      colors: [],
      tags: '',
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      discountPrice: product.discountPrice?.toString() || '',
      category: product.category?._id || '',
      images: product.images || [],
      videoUrl: product.videoUrl || '',
      sizes: product.sizes?.length ? product.sizes : SIZES.map((s) => ({ size: s, quantity: 10 })),
      colors: product.colors?.length ? product.colors : [],
      tags: product.tags?.join(', ') || '',
      isFeatured: product.isFeatured || false,
      isNewArrival: product.isNewArrival || false,
      isBestSeller: product.isBestSeller || false,
      isActive: product.isActive !== false,
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          uploadedUrls.push(data.url);
        }
      }
      setForm((f) => ({ ...f, images: [...f.images, ...uploadedUrls] }));
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const productData = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : undefined,
        category: form.category || undefined,
        images: form.images,
        videoUrl: form.videoUrl || undefined,
        sizes: form.sizes,
        colors: form.colors,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
        isFeatured: form.isFeatured,
        isNewArrival: form.isNewArrival,
        isBestSeller: form.isBestSeller,
        isActive: form.isActive,
      };

      if (editingProduct) {
        await api.patch(`/products/${editingProduct._id}`, productData);
        alert('Product updated successfully!');
      } else {
        await api.post('/products/create', productData);
        alert('Product created successfully!');
      }

      setShowModal(false);
      fetchProducts();
      setForm({
        name: '',
        description: '',
        price: '',
        discountPrice: '',
        category: '',
        images: [],
        videoUrl: '',
        sizes: SIZES.map((s) => ({ size: s, quantity: 10 })),
        colors: [],
        tags: '',
        isFeatured: false,
        isNewArrival: true,
        isBestSeller: false,
        isActive: true,
      });
    } catch (err) {
      console.error(err);
      alert('Failed to save product');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/products/${id}`);
      alert('Product deleted successfully!');
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to delete product');
    }
  };

  const handleStatusToggle = async (product: Product, field: 'isActive' | 'isFeatured' | 'isNewArrival' | 'isBestSeller') => {
    try {
      await api.patch(`/products/${product._id}`, {
        [field]: !product[field],
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={openCreateModal}>+ Add Product</Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {loading ? (
        <div className="h-48 animate-pulse rounded bg-neutral-200" />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id} className="border-t">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 overflow-hidden rounded bg-neutral-100">
                        <Image
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=100'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-neutral-500">{product.tags?.slice(0, 2).join(', ')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      {product.discountPrice ? (
                        <>
                          <span className="font-medium">{formatPrice(product.discountPrice)}</span>
                          <span className="ml-2 text-sm text-neutral-400 line-through">{formatPrice(product.price)}</span>
                        </>
                      ) : (
                        <span className="font-medium">{formatPrice(product.price)}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={product.stock === 0 ? 'text-red-500' : product.stock < 10 ? 'text-yellow-500' : ''}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded bg-neutral-100 px-2 py-1 text-sm">
                      {product.category?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={() => handleStatusToggle(product, 'isActive')}
                        className={`rounded px-2 py-1 text-xs ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                      >
                        {product.isActive ? 'Active' : 'Inactive'}
                      </button>
                      {product.isFeatured && (
                        <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-700">Featured</span>
                      )}
                      {product.isNewArrival && (
                        <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">New</span>
                      )}
                      {product.isBestSeller && (
                        <span className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-700">Best Seller</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-700 hover:bg-blue-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="rounded bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="p-8 text-center text-neutral-500">
              No products found
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Product Name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full rounded border border-neutral-300 px-4 py-2.5"
                rows={4}
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  type="number"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  required
                />
                <Input
                  type="number"
                  placeholder="Discount Price (optional)"
                  value={form.discountPrice}
                  onChange={(e) => setForm((f) => ({ ...f, discountPrice: e.target.value }))}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full rounded border border-neutral-300 px-4 py-2.5"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Product Images</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="mb-2 block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200"
                />
                {uploading && <p className="text-sm text-neutral-500">Uploading images...</p>}
                {form.images.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {form.images.map((url, index) => (
                      <div key={index} className="relative">
                        <img src={url} alt={`Product ${index + 1}`} className="h-20 w-20 rounded object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video URL */}
              <Input
                placeholder="Video URL (optional)"
                value={form.videoUrl}
                onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
              />

              {/* Sizes */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Sizes & Stock</label>
                <div className="grid grid-cols-4 gap-4">
                  {form.sizes.map((s, i) => (
                    <div key={s.size}>
                      <label className="mb-1 block text-xs text-neutral-500">{s.size}</label>
                      <Input
                        type="number"
                        min="0"
                        value={s.quantity}
                        onChange={(e) => {
                          const newSizes = [...form.sizes];
                          newSizes[i] = { ...s, quantity: parseInt(e.target.value) || 0 };
                          setForm((f) => ({ ...f, sizes: newSizes }));
                        }}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Colors & Stock</label>
                <div className="space-y-2">
                  {form.colors.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="relative h-10 w-10 overflow-hidden rounded border">
                        {c.image ? (
                          <img src={c.image} alt="Color" fill className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-xs">No img</div>
                        )}
                      </div>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Quantity"
                        value={c.quantity}
                        onChange={(e) => {
                          const newColors = [...form.colors];
                          newColors[i] = { ...c, quantity: parseInt(e.target.value) || 0 };
                          setForm((f) => ({ ...f, colors: newColors }));
                        }}
                        className="w-24"
                      />
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, colors: f.colors.filter((_, idx) => idx !== i) }))}
                        className="rounded bg-red-100 px-2 py-1 text-sm text-red-600 hover:bg-red-200"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded bg-neutral-100 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploading(true);
                        try {
                          const formData = new FormData();
                          formData.append('file', file);
                          const response = await fetch('/api/upload', { method: 'POST', body: formData });
                          if (response.ok) {
                            const data = await response.json();
                            setForm((f) => ({ ...f, colors: [...f.colors, { image: data.url, quantity: 10 }] }));
                          }
                        } catch (err) {
                          console.error('Upload failed:', err);
                        } finally {
                          setUploading(false);
                        }
                      }}
                      className="hidden"
                    />
                    {uploading ? 'Uploading...' : '+ Add Color'}
                  </label>
                </div>
              </div>

              {/* Tags */}
              <Input
                placeholder="Tags (comma separated)"
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              />

              {/* Checkboxes */}
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                    className="rounded border-neutral-300"
                  />
                  <span className="text-sm">Active</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                    className="rounded border-neutral-300"
                  />
                  <span className="text-sm">Featured</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.isNewArrival}
                    onChange={(e) => setForm((f) => ({ ...f, isNewArrival: e.target.checked }))}
                    className="rounded border-neutral-300"
                  />
                  <span className="text-sm">New Arrival</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.isBestSeller}
                    onChange={(e) => setForm((f) => ({ ...f, isBestSeller: e.target.checked }))}
                    className="rounded border-neutral-300"
                  />
                  <span className="text-sm">Best Seller</span>
                </label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={formLoading} className="flex-1">
                  {formLoading ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
