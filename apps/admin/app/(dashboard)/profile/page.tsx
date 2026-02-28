"use client";
import { useEffect, useState } from "react";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Camera,
  Shield,
  Settings,
  Bell,
  Key,
  Globe,
  Loader2,
  Check,
} from "lucide-react";
import { getUser, setUser as setLocalUser } from "@/app/utils/helpers";
import { privateRequest } from "@/app/config/axios.config";
import { Toastify } from "@/app/components/ui/toastify";

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [userData, setUserData] = useState<any>({
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    avatar: "",
  });

  useEffect(() => {
    const user = getUser();
    if (user) {
      setUserData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        location: user.location || "",
      });
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log(userData, "-------->");
      const response = await privateRequest.patch(
        "/user/profile/update",
        userData,
      );
      if (response.data) {
        setLocalUser(response.data);
        Toastify.Success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      Toastify.Error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="relative">
        <div className="h-48 rounded-[2.5rem] bg-gradient-to-r from-indigo-600 to-violet-600 shadow-xl overflow-hidden">
          <div className="absolute inset-0 opacity-20 flex items-center justify-center">
            <Globe className="w-96 h-96 text-white scale-150 rotate-12" />
          </div>
        </div>
        <div className="absolute -bottom-16 left-12 flex items-end gap-6">
          <div className="relative group">
            <div className="h-40 w-40 rounded-[2.5rem] bg-white p-2 shadow-2xl transition-transform group-hover:scale-105 duration-300">
              <img
                src={
                  userData.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`
                }
                alt="Profile"
                className="h-full w-full rounded-[2rem] bg-indigo-50"
              />
            </div>
            <button className="absolute bottom-2 right-2 p-3 bg-indigo-600 text-white rounded-2xl shadow-lg hover:bg-indigo-700 transition-all">
              <Camera className="h-5 w-5" />
            </button>
          </div>
          <div className="pb-6">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {userData.name || "User"}
            </h1>
            <p className="text-slate-500 font-medium">
              System Administrator • Since 2026
            </p>
          </div>
        </div>
        <div className="absolute -bottom-16 right-0 pb-6 flex gap-3">
          <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 cursor-pointer"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Save Changes
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-24 grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: "general", label: "General Info", icon: UserIcon },
            { id: "security", label: "Security", icon: Shield },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "settings", label: "Account Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100"
                    : "text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-100"
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 space-y-10">
            {activeTab === "general" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      Full Name
                    </label>
                    <div className="relative group">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                      <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                      <input
                        type="email"
                        name="email"
                        value={userData.email}
                        readOnly
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border border-slate-100 rounded-2xl outline-none font-medium text-slate-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                      <input
                        type="tel"
                        name="phone"
                        value={userData.phone}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      Location
                    </label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                      <input
                        type="text"
                        name="location"
                        value={userData.location}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    name="bio"
                    value={userData.bio}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium text-slate-900 resize-none"
                  ></textarea>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
                  <Shield className="h-6 w-6 text-amber-600 mt-1" />
                  <div>
                    <h4 className="text-sm font-extrabold text-amber-900">
                      Two-Factor Authentication
                    </h4>
                    <p className="text-xs text-amber-700 mt-1 font-medium leading-relaxed">
                      Boost your account's safety by adding a second layer of
                      security. We'll send a code to your phone every time you
                      log in.
                    </p>
                    <button className="mt-4 px-5 py-2.5 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-all">
                      Enable 2FA
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-4">
                    Change Password
                  </h4>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
