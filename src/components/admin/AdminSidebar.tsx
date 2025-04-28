
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useDocsContext } from "@/context/DocsContext";
import {
  LayoutGrid,
  FileText,
  FolderOpen,
  Users,
  Settings,
} from "lucide-react";

export function AdminSidebar() {
  const location = useLocation();
  const { currentUser } = useDocsContext();

  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "guide editor")) return null;

  // Define the type for menu items
  type MenuItem = {
    title: string;
    path: string;
    icon: React.ElementType;
    exact: boolean;
    external?: boolean;
  };

  const menuItems: MenuItem[] = [
    { 
      title: "Dashboard", 
      path: "/admin", 
      icon: LayoutGrid, 
      exact: true 
    },
    { 
      title: "Pages", 
      path: "/admin/pages", 
      icon: FileText, 
      exact: false 
    },
    { 
      title: "Categories", 
      path: "/admin/categories", 
      icon: FolderOpen, 
      exact: false 
    },
  ];
  if (currentUser.role === "admin") {
    menuItems.push(
      { 
        title: "Users", 
        path: "/admin/users", 
        icon: Users, 
        exact: false 
      },
      { 
        title: "Settings", 
        path: "/admin/settings", 
        icon: Settings, 
        exact: false 
      }
    );
  }

  // Add Home button
  menuItems.push({
    title: "Go to Home",
    path: "https://idhosting.dk",
    icon: LayoutGrid,
    exact: false,
    external: true
  });
  
  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <Link to="/admin" className="text-xl font-semibold flex items-center gap-2">
          <span className="text-doc-purple">Admin</span>
          <span>Dashboard</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild>
                  {item.external ? (
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                        isActive
                          ? "text-sidebar-primary bg-sidebar-accent"
                          : "hover:bg-sidebar-accent/50"
                      }`}
                    >
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </a>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                        isActive
                          ? "text-sidebar-primary bg-sidebar-accent"
                          : "hover:bg-sidebar-accent/50"
                      }`}
                    >
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </Link>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
