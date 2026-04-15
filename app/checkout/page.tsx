'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useValidateDiscountMutation, useCreateOrderMutation } from '@/store/api';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { token, user } = useAuthStore();

  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [discountError, setDiscountError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    city: '',
  });

  const subtotal = getSubtotal();
  const total = Math.max(0, subtotal - discount);

  const [validateDiscount] = useValidateDiscountMutation();
  const [createOrder] = useCreateOrderMutation();

  const handleValidateDiscount = async () => {
    if (!discountCode.trim()) return;
    setDiscountError('');
    try {
      const res = await validateDiscount({ code: discountCode.trim(), subtotal }).unwrap();
      if (res.valid && res.discount) {
        setDiscount(res.discount);
      } else {
        setDiscountError(res.error || 'Invalid code');
      }
    } catch {
      setDiscountError('Could not validate code');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      router.push('/login?redirect=/checkout');
      return;
    }
    if (!form.name || !form.phone || !form.address || !form.city) {
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        size: i.size,
        image: i.image,
      }));

      await createOrder({
        items: orderItems,
        shippingAddress: form,
        paymentMethod: 'cod',
        discountCode: discount > 0 ? discountCode : undefined,
      }).unwrap();

      clearCart();
      router.push('/orders?success=1');
    } catch (err) {
      console.error(err);
      alert('Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!items.length && !loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <Link href="/products">
          <Button className="mt-6">Shop Now</Button>
        </Link>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h2 className="text-2xl font-bold">Please log in to checkout</h2>
        <Link href="/login?redirect=/checkout">
          <Button className="mt-6">Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <h1 className="mb-8 text-3xl font-bold text-neutral-900">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Shipping Address</h3>
          <Input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <Input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            required
          />
          <Input
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            required
          />
          <Input
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            required
          />
        </div>
        <div>
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Discount code"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="sm" onClick={handleValidateDiscount}>
                  Apply
                </Button>
              </div>
              {discountError && <p className="text-sm text-red-600">{discountError}</p>}
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-4 text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <Button type="submit" className="mt-6 w-full" loading={loading}>
              Place Order
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
