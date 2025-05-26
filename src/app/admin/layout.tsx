
"use client"

import Link from "next/link"
import {
  LayoutDashboard,
  Briefcase,
  Star,
  GraduationCap,
  Award,
  Settings,
  Code2,
  UserCircle,
  LogOut,
  Loader2,
  Palette,
  Puzzle, // Added for Integrations
} from "lucide-react"
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggleButton } from "@/app/components/theme-toggle-button"
import { SidebarInset } from "@/components/ui/sidebar"

const ADMIN_AUTH_TOKEN_KEY = 'adminAuthToken';

const adminNavItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "About Me", href: "/admin/about", icon: UserCircle },
  { name: "Skills", href: "/admin/skills", icon: Star },
  { name: "Education", href: "/admin/education", icon: GraduationCap },
  { name: "Projects", href: "/admin/projects", icon: Briefcase },
  { name: "Certifications", href: "/admin/certifications", icon: Award },
  { name: "Site Settings", href: "/admin/settings", icon: Palette },
  { name: "Integrations", href: "/admin/integrations", icon: Puzzle }, // New item
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const userName = "Admin User"; 
  const userEmail = "admin@example.com"; 

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_AUTH_TOKEN_KEY);
    if (token === 'true') {
      setIsAuthenticated(true);
      if (pathname === '/admin/login') {
        router.replace('/admin'); 
      }
    } else {
      setIsAuthenticated(false);
      if (pathname !== '/admin/login') {
        router.replace('/admin/login'); 
      }
    }
    setIsAuthenticating(false);
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  if (isAuthenticating) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" /> Verifying access...
      </div>
    );
  }

  if (!isAuthenticated && pathname !== '/admin/login') {
    return null; 
  }
  
  if (!isAuthenticated && pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4">
          <Link href="/admin" className="flex items-center gap-2 text-xl font-semibold text-sidebar-primary hover:text-sidebar-accent transition-colors">
            <Code2 className="h-7 w-7" />
            <span className="group-data-[collapsible=icon]:hidden">ByteFolio Admin</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {adminNavItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild tooltip={item.name} data-active={pathname === item.href}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Log Out" onClick={handleLogout}>
                    <LogOut />
                    <span>Log Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-md px-4 md:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
            </div>
            <div className="flex items-center gap-4">
                <ThemeToggleButton />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                        <Avatar className="h-9 w-9">
                        <AvatarImage src="https://picsum.photos/seed/adminavatar/100/100" alt="@admin" data-ai-hint="user avatar" />
                        <AvatarFallback>{userName.substring(0,1).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {userEmail}
                        </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/admin/about')}>
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>Profile (About Me)</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/admin/settings')}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Site Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
