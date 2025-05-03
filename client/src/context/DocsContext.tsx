
import React, { createContext, useState, useContext, useEffect } from "react";
import { Category, DocPage, User } from "../../shared/types/docs";
import { mockCategories, mockPages, mockUsers } from "../services/mockData";
import { v4 as uuid } from "uuid";
import { useToast } from "../hooks/use-toast";

interface DocsContextType {
  // Data
  categories: Category[];
  pages: DocPage[];
  currentUser: User | null;
  currentPage: DocPage | null;
  
  // Category actions
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Page actions
  addPage: (page: Omit<DocPage, "id" | "createdAt" | "updatedAt">) => void;
  updatePage: (id: string, page: Partial<DocPage>, options?: { suppressToast?: boolean }) => void;
  deletePage: (id: string) => void;
  setCurrentPage: (pageId: string | null) => void;
  
  // Auth actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  resetAllViews: () => void;
}

const DocsContext = createContext<DocsContextType | undefined>(undefined);

export const DocsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [pages, setPages] = useState<DocPage[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPageState] = useState<DocPage | null>(null);
  
  // Load initial data
  useEffect(() => {
    // Try to load from localStorage first
    const storedPages = localStorage.getItem("docHubPages");
    if (storedPages) {
      setPages(JSON.parse(storedPages));
    } else {
      setPages(mockPages);
    }
    setCategories(mockCategories);
    
    // Check for stored auth
    const storedUser = localStorage.getItem("docHubUser");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem("docHubUser");
      }
    }
  }, []);
  
  // Save pages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("docHubPages", JSON.stringify(pages));
  }, [pages]);
  
  // Category actions
  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory = { ...category, id: uuid() };
    setCategories([...categories, newCategory]);
    toast({
      title: "Success",
      description: `Category "${category.title}" has been created`,
    });
  };
  
  const updateCategory = (id: string, categoryUpdate: Partial<Category>) => {
    setCategories(
      categories.map((cat) => (cat.id === id ? { ...cat, ...categoryUpdate } : cat))
    );
    toast({
      title: "Success",
      description: "Category has been updated",
    });
  };
  
  const deleteCategory = (id: string) => {
    // Check if category has pages
    const hasPages = pages.some((page) => page.categoryId === id);
    
    if (hasPages) {
      toast({
        title: "Error",
        description: "Cannot delete category with pages. Move or delete the pages first.",
        variant: "destructive",
      });
      return;
    }
    
    setCategories(categories.filter((cat) => cat.id !== id));
    toast({
      title: "Success",
      description: "Category has been deleted",
    });
  };
  
  // Page actions
  const addPage = (page: Omit<DocPage, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newPage = {
      ...page,
      id: uuid(),
      createdAt: now,
      updatedAt: now,
    };
    setPages([...pages, newPage]);
    toast({
      title: "Success",
      description: `Page "${page.title}" has been created`,
    });
  };
  
  const updatePage = (
    id: string,
    pageUpdate: Partial<DocPage>,
    options?: { suppressToast?: boolean }
  ) => {
    setPages(
      pages.map((page) =>
        page.id === id
          ? { ...page, ...pageUpdate, updatedAt: new Date().toISOString() }
          : page
      )
    );
  
    // Update current page if it's the one being edited
    if (currentPage && currentPage.id === id) {
      setCurrentPageState({ ...currentPage, ...pageUpdate });
    }
  
    if (!options?.suppressToast) {
      toast({
        title: "Success",
        description: "Page has been updated",
      });
    }
  };
  
  const deletePage = (id: string) => {
    setPages(pages.filter((page) => page.id !== id));
    
    // Reset current page if it's the one being deleted
    if (currentPage && currentPage.id === id) {
      setCurrentPageState(null);
    }
    
    toast({
      title: "Success",
      description: "Page has been deleted",
    });
  };
  
  const setCurrentPage = (pageId: string | null) => {
    if (!pageId) {
      setCurrentPageState(null);
      return;
    }
    
    const page = pages.find((p) => p.id === pageId);
    setCurrentPageState(page || null);
  };
  
  // Auth actions
  const login = async (email: string, password: string): Promise<boolean> => {
    // This is a mock login. In a real app, you'd call an API
    const user = mockUsers.find((u) => u.email === email);
    
    if (user && password === "password") {
      // For demo, any password will work as "password"
      setCurrentUser(user);
      localStorage.setItem("docHubUser", JSON.stringify(user));
      toast({
        title: "Logged in",
        description: `Welcome back, ${user.name || user.email}!`,
      });
      return true;
    }
    
    toast({
      title: "Login failed",
      description: "Invalid email or password",
      variant: "destructive",
    });
    return false;
  };
  
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("docHubUser");
    toast({
      title: "Logged out",
      description: "You've been logged out successfully",
    });
  };
  
  const resetAllViews = () => {
    setPages(pages.map(page => ({ ...page, views: 0 })));
    toast({
      title: "Success",
      description: "All page view counts have been reset",
    });
  };

  const contextValue: DocsContextType = {
    categories,
    pages,
    currentUser,
    currentPage,
    addCategory,
    updateCategory,
    deleteCategory,
    addPage,
    updatePage,
    deletePage,
    setCurrentPage,
    login,
    logout,
    resetAllViews,
  };
  
  return (
    <DocsContext.Provider value={contextValue}>{children}</DocsContext.Provider>
  );
};

export const useDocsContext = (): DocsContextType => {
  const context = useContext(DocsContext);
  
  if (context === undefined) {
    throw new Error("useDocsContext must be used within a DocsProvider");
  }
  
  return context;
};
