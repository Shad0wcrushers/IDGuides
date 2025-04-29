
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDocsContext } from "../../context/DocsContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../ui/sidebar";
import { Button } from "../ui/button";
import { Book, BookOpen } from "lucide-react";

export function DocSidebar() {
  const { categories, pages } = useDocsContext();
  const location = useLocation();
  
  // Expanded state for categories (all expanded by default)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    categories.reduce((acc, cat) => ({ ...acc, [cat.id]: true }), {})
  );
  
  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };
  
  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-4 py-2">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Book size={20} className="text-doc-purple" />
          <span>Documentation</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {categories
          .sort((a, b) => a.order - b.order)
          .map((category) => {
            const categoryPages = pages
              .filter((p) => p.categoryId === category.id)
              .sort((a, b) => a.order - b.order);
              
            return (
              <SidebarGroup key={category.id}>
                <SidebarGroupLabel
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleCategory(category.id)}
                >
                  <span>{category.title}</span>
                  <span className="text-xs text-muted-foreground">{categoryPages.length}</span>
                </SidebarGroupLabel>
                
                {expandedCategories[category.id] && (
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {categoryPages.map((page) => {
                        const isActive = location.pathname === `/docs/${category.slug}/${page.slug}`;
                        
                        return (
                          <SidebarMenuItem key={page.id}>
                            <SidebarMenuButton asChild>
                              <Link 
                                to={`/docs/${category.slug}/${page.slug}`}
                                className={`flex items-center gap-2 ${
                                  isActive ? "text-sidebar-primary font-medium" : ""
                                }`}
                              >
                                {isActive ? (
                                  <BookOpen size={16} className="text-sidebar-primary" />
                                ) : (
                                  <Book size={16} />
                                )}
                                <span>{page.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                )}
              </SidebarGroup>
            );
          })}
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <Button variant="outline" className="w-full" asChild>
          <a 
            href="https://client.idhosting.dk/submitticket.php?step=2&deptid=2" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Support Center
          </a>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
