'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'seller' | 'customer';
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'seller' as 'admin' | 'seller' | 'customer',
    phone: '',
    address: '',
    isActive: true,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await api.get<User[]>('/users');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setForm({
      name: '',
      email: '',
      password: '',
      role: 'seller',
      phone: '',
      address: '',
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      phone: user.phone || '',
      address: user.address || '',
      isActive: user.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (editingUser) {
        // Update existing user
        const updateData: Record<string, unknown> = {
          name: form.name,
          email: form.email,
          role: form.role,
          phone: form.phone || undefined,
          address: form.address || undefined,
          isActive: form.isActive,
        };
        
        // Only include password if it's provided
        if (form.password) {
          updateData.password = form.password;
        }

        await api.patch(`/users/${editingUser._id}`, updateData);
        alert('User updated successfully!');
      } else {
        // Create new user
        await api.post('/users', {
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          phone: form.phone || undefined,
          address: form.address || undefined,
        });
        alert('User created successfully!');
      }

      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      alert('User deleted successfully!');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const toggleUserStatus = async (user: User) => {
    try {
      await api.patch(`/users/${user._id}`, {
        isActive: !user.isActive,
      });
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Failed to update user status.');
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'seller':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Employee Management</h1>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button onClick={openCreateModal}>+ Add Employee</Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-lg border border-neutral-200">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-white">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-neutral-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="font-medium text-neutral-900">{user.name}</div>
                    {user.phone && (
                      <div className="text-sm text-neutral-500">{user.phone}</div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-neutral-600">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <button
                      onClick={() => toggleUserStatus(user)}
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.isActive
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-neutral-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <button
                      onClick={() => openEditModal(user)}
                      className="mr-3 text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-sm font-medium text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingUser ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">
                  Name *
                </label>
                <Input
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">
                  Email *
                </label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">
                  {editingUser ? 'New Password (leave blank to keep current)' : 'Password *'}
                </label>
                <Input
                  type="password"
                  placeholder={editingUser ? 'Enter new password' : 'Password'}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  required={!editingUser}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">
                  Role *
                </label>
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      role: e.target.value as 'admin' | 'seller' | 'customer',
                    }))
                  }
                  className="w-full rounded border border-neutral-300 px-4 py-2.5"
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="seller">Seller</option>
                  <option value="customer">Customer</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">
                  Phone
                </label>
                <Input
                  type="tel"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">
                  Address
                </label>
                <textarea
                  placeholder="Address"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  className="w-full rounded border border-neutral-300 px-4 py-2.5"
                  rows={2}
                />
              </div>

              {editingUser && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={form.isActive}
                    onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                    className="h-4 w-4 rounded border-neutral-300"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-neutral-700">
                    Active
                  </label>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowModal(false)}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button type="submit" loading={formLoading}>
                  {editingUser ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
