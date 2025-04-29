
import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { MainLayout } from "../../components/layout/MainLayout";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { useDocsContext } from "../../context/DocsContext";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { currentUser } = useDocsContext();
  
  // Redirect non-admin users
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else if (currentUser.role !== "admin") {
      navigate("/");
    }
  }, [currentUser, navigate]);
  
  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }
  
  return (
    <MainLayout>
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 overflow-y-auto bg-background">
          <div className="container py-6 px-4 max-w-6xl">
            <Outlet />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminLayout;
