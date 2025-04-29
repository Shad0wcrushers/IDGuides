
import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { DocSidebar } from "../components/docs/DocSidebar";
import { DocContent } from "../components/docs/DocContent";
import { useDocsContext } from "../context/DocsContext";

const DocsPage = () => {
  const { categorySlug, pageSlug } = useParams<{
    categorySlug?: string;
    pageSlug?: string;
  }>();
  
  const { categories, pages } = useDocsContext();
  
  // If navigating to /docs without specific category/page, redirect to first page
  if (!categorySlug || !pageSlug) {
    const firstCategory = categories[0];
    if (firstCategory) {
      const firstPage = pages
        .filter((p) => p.categoryId === firstCategory.id)
        .sort((a, b) => a.order - b.order)[0];
      
      if (firstPage) {
        return <Navigate to={`/docs/${firstCategory.slug}/${firstPage.slug}`} replace />;
      }
    }
  }
  
  return (
    <MainLayout>
      <div className="flex flex-1 overflow-hidden">
        <DocSidebar />
        <div className="flex-1 overflow-auto">
          <DocContent />
        </div>
      </div>
    </MainLayout>
  );
};

export default DocsPage;
