'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

// Icons
import { 
  Home, 
  FileText, 
  Lightbulb, 
  Calendar, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home
  },
  {
    name: 'Swipe Files',
    href: '/swipe-files',
    icon: FileText
  },
  {
    name: 'Ideas',
    href: '/ideas',
    icon: Lightbulb
  },
  {
    name: 'Content',
    href: '/content',
    icon: Calendar
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div 
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          {!collapsed && (
            <Link href="/dashboard" className="text-xl font-bold text-sidebar-primary">
              ContentCanvas
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md text-sidebar-foreground hover:bg-sidebar-accent focus:outline-none"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  )}
                >
                  <item.icon className={cn(
                    'flex-shrink-0 h-5 w-5',
                    isActive ? 'text-sidebar-primary-foreground' : 'text-sidebar-foreground'
                  )} />
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-sidebar-border">
          <Link
            href="/account/settings"
            className={cn(
              'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
              pathname === '/account/settings'
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            )}
          >
            <Settings className={cn(
              'flex-shrink-0 h-5 w-5',
              pathname === '/account/settings' ? 'text-sidebar-primary-foreground' : 'text-sidebar-foreground'
            )} />
            {!collapsed && <span className="ml-3">Settings</span>}
          </Link>
        </div>
      </div>
    </div>
  );
} 