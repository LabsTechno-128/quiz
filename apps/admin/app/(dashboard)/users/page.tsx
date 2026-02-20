"use client";

import { useState, useEffect } from "react";
import { privateRequest } from "@/app/config/axios.config";
import {
  Users,
  Search,
  MoreVertical,
  Trash2,
  Shield,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  UserPlus
} from "lucide-react";
import { Toastify } from "@/app/components/ui/toastify";

export default function UsersPage() {
  const [users, setUsers] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await privateRequest.get("/user");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      Toastify.Error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id: any) => {
    try {
      const response = await privateRequest.patch(`/user/${id}/toggle-status`);
      if (response.data) {
        setUsers(users.map((u: any) => u.id === id ? response.data : u));
        Toastify.Success("User status updated");
      }
    } catch (error) {
      Toastify.Error("Failed to update user status");
    }
  };

  const handleDelete = async (id: any) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await privateRequest.delete(`/user/${id}`);
        setUsers(users.filter((u: any) => u.id !== id));
        Toastify.Success("User deleted successfully");
      } catch (error) {
        Toastify.Error("Failed to delete user");
      }
    }
  };

  const filteredUsers = users.filter((user: any) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Users</h1>
          <p className="text-sm text-slate-500 font-medium">Manage user accounts, roles, and access status.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 rounded-2xl text-sm font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
          <UserPlus className="h-4 w-4" />
          Add New User
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{users.length}</p>
            <p className="text-xs font-bold text-slate-400 uppercase">Total Users</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{users.filter((u: any) => u.isActive).length}</p>
            <p className="text-xs font-bold text-slate-400 uppercase">Active Now</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <XCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{users.filter((u: any) => !u.isActive).length}</p>
            <p className="text-xs font-bold text-slate-400 uppercase">Inactive Accounts</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border-none text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center text-slate-400 font-medium">Loading user data...</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User Profile</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Contact Info</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((user: any) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                          className="h-10 w-10 rounded-xl bg-slate-100"
                          alt=""
                        />
                        <div>
                          <p className="text-sm font-bold text-slate-900">{user.name || "Unnamed User"}</p>
                          <p className="text-[10px] font-medium text-slate-400">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                          <Mail className="h-3 w-3 text-slate-400" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                            <Phone className="h-3 w-3 text-slate-400" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-2">
                        {user.roles.map((role: any) => (
                          <span key={role} className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${role.includes('admin') ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                            {role.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all ${user.isActive ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}
                      >
                        <div className={`h-1.5 w-1.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {user.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 rounded-xl text-slate-300 hover:bg-rose-50 hover:text-rose-600 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button className="p-2 rounded-xl text-slate-300 hover:bg-slate-100 hover:text-slate-600 transition-all">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
