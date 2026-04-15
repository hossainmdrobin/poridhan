'use client';

import { formatPrice } from '@/lib/utils';
import { useGetOrdersQuery } from '@/store/api';

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useGetOrdersQuery();

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Orders</h1>
      {isLoading ? (
        <div className="h-48 animate-pulse rounded bg-neutral-200" />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((o) => (
                <tr key={o._id} className="border-t">
                  <td className="px-4 py-3 font-medium">{o.orderNumber}</td>
                  <td className="px-4 py-3">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3 capitalize">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
