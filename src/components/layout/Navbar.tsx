'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Icons
import { 
  Home, 
  FileText, 
  Lightbulb, 
  Calendar, 
  Settings,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Plus,
  Moon,
  Sun,
  Bell
} from 'lucide-react';

// Import button component
import { Button } from '@/components/ui/button';

const navItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Overview of your content'
  },
  {
    name: 'Swipe Files',
    href: '/swipe-files',
    icon: FileText,
    description: 'Inspiration and references'
  },
  {
    name: 'Ideas',
    href: '/ideas',
    icon: Lightbulb,
    description: 'Capture and organize ideas'
  },
  {
    name: 'Content',
    href: '/content',
    icon: Calendar,
    description: 'Schedule and manage content'
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(2); // Example notification count
  const userMenuRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    getUser();
    
    // Check for dark mode preference
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('darkMode') === 'true' || 
                    window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    }

    // Add event listener for clicks outside of user menu
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  async function getUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    } catch (error) {
      console.error('Error getting user:', error);
    }
  }

  function handleClickOutside(event: MouseEvent) {
    if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
      setUserMenuOpen(false);
    }
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  function toggleDarkMode() {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', (!isDarkMode).toString());
    }
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg transition-colors duration-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-[var(--primary-500)] font-bold text-xl flex items-center">
                <div className="w-8 h-8 rounded-md bg-[var(--primary-500)] text-white flex items-center justify-center mr-2 font-bold">
                  CP
                </div>
                <span className="hidden sm:block">ContentPlanner</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "nav-link group relative",
                      isActive
                        ? "text-[var(--primary-600)] dark:text-[var(--primary-400)] bg-[var(--primary-50)] dark:bg-[var(--primary-900)]/50"
                        : ""
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                    
                    {/* Tooltip */}
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-10 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                      {item.description}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side actions */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button className="icon-button relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
            
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="icon-button"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            {/* Quick Add Button */}
            <Button 
              variant="gradient" 
              size="sm"
              className="rounded-full"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Idea
            </Button>

            {/* User menu dropdown */}
            <div className="ml-3 relative" ref={userMenuRef}>
              <div>
                <button
                  type="button"
                  className="flex items-center gap-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--primary-300)] p-1"
                  id="user-menu-button"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-[var(--primary-100)] dark:bg-[var(--primary-800)] flex items-center justify-center text-[var(--primary-700)] dark:text-[var(--primary-300)]">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden md:block text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {user?.email?.split('@')[0] || 'User'}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* User dropdown menu */}
              {userMenuOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700 animate-fade-in"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex={-1}
                >
                  <div className="py-3 px-4" role="none">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-[var(--primary-100)] dark:bg-[var(--primary-800)] flex items-center justify-center text-[var(--primary-700)] dark:text-[var(--primary-300)] mr-3">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{user?.email?.split('@')[0] || 'User'}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 truncate">{user?.email || ''}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1" role="none">
                    <Link
                      href="/account/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-0"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      Your Profile
                    </Link>
                    <Link
                      href="/account/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-1"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      Settings
                    </Link>
                  </div>
                  <div className="py-1" role="none">
                    <button
                      className="flex w-full items-center px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-2"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-3 h-4 w-4 text-red-500 dark:text-red-400" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden space-x-2">
            {/* Notifications for mobile */}
            <div className="relative">
              <button className="icon-button relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
            
            {/* Dark mode toggle for mobile */}
            <button
              onClick={toggleDarkMode}
              className="icon-button"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <button
              type="button"
              className="icon-button"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">{mobileMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden animate-slide-in-up" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "nav-link block",
                    isActive
                      ? "text-[var(--primary-600)] dark:text-[var(--primary-400)] bg-[var(--primary-50)] dark:bg-[var(--primary-900)]/50"
                      : ""
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-5 w-5" />
                    <div>
                      <div>{item.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                    </div>
                  </div>
                </Link>
              );
            })}
            
            {/* Quick Add Button for mobile */}
            <div className="px-3 py-2">
              <Button 
                variant="gradient" 
                size="sm"
                className="w-full justify-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                New Idea
              </Button>
            </div>
            
            {/* User profile for mobile */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-3">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-[var(--primary-100)] dark:bg-[var(--primary-800)] flex items-center justify-center text-[var(--primary-700)] dark:text-[var(--primary-300)] text-lg">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-gray-200">{user?.email?.split('@')[0] || 'User'}</div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{user?.email || ''}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  href="/account/profile"
                  className="nav-link block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="mr-3 h-5 w-5" />
                  Your Profile
                </Link>
                <Link
                  href="/account/settings"
                  className="nav-link block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="mr-3 h-5 w-5" />
                  Settings
                </Link>
                <button
                  className="w-full text-left nav-link block text-red-600 dark:text-red-400"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 