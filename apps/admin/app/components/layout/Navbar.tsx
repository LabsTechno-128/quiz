'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, LayoutDashboard, Users, Settings, LogOut, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Categories', href: '/category', icon: <Users className="w-5 h-5" /> },
    { name: 'Settings', href: '/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-white border-b border-gray-200   w-full z-10 mb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                ThinkHive
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden md:ml-4 md:flex md:items-center">
            <div className="ml-3 relative">
              <div>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <span className="font-medium">AD</span>
                  </div>
                  <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                </button>
              </div>
              {profileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <Link
                      href="/logout"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <span className="font-medium">AD</span>
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">Admin User</div>
                <div className="text-sm font-medium text-gray-500">admin@example.com</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                href="/profile"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Your Profile
              </Link>
              <Link
                href="/settings"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Settings
              </Link>
              <Link
                href="/logout"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <LogOut className="mr-2 h-5 w-5" />
                  Sign out
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
