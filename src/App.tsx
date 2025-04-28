
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DocsProvider } from "@/context/DocsContext";

// Pages
import Index from "./pages/Index";
import DocsPage from "./pages/DocsPage";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import PagesAdmin from "./pages/admin/PagesAdmin";
import CategoriesAdmin from "./pages/admin/CategoriesAdmin";
import UsersAdmin from "./pages/admin/UsersAdmin";
import SettingsAdmin from "./pages/admin/SettingsAdmin";
import CreatePage from "./pages/admin/CreatePage";
import EditPage from "./pages/admin/EditPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DocsProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/docs/:categorySlug/:pageSlug" element={<DocsPage />} />
            <Route path="/login" element={<Login />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="pages" element={<PagesAdmin />} />
              <Route path="pages/create" element={<CreatePage />} />
              <Route path="edit/:pageId" element={<EditPage />} />
              <Route path="categories" element={<CategoriesAdmin />} />
              <Route path="users" element={<UsersAdmin />} />
              <Route path="settings" element={<SettingsAdmin />} />
            </Route>
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DocsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
