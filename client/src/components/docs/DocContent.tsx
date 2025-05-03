
import React from "react";
import { useDocsContext } from "../../context/DocsContext";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Edit, Calendar } from "lucide-react";
import { formatDate } from "../../lib/utils";

export function DocContent() {
  const { categorySlug, pageSlug } = useParams<{ categorySlug: string; pageSlug: string }>();
  const navigate = useNavigate();
  const { pages, categories, currentUser, setCurrentPage, updatePage } = useDocsContext();
  
  const category = categories.find((c) => c.slug === categorySlug);
  const page = pages.find((p) => p.slug === pageSlug && p.categoryId === category?.id);
  
  const isAdmin = currentUser?.role === "admin";
  
  const [lastViewedPageId, setLastViewedPageId] = React.useState<string | null>(null);
  const viewIncrementedRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (page && viewIncrementedRef.current !== page.id) {
      setCurrentPage(page.id);
      updatePage(page.id, { views: (page.views ?? 0) + 1 }, { suppressToast: true });
      viewIncrementedRef.current = page.id;
    }
    return () => {
      setCurrentPage(null);
      // Do not reset viewIncrementedRef here, so it persists for this session
    };
  }, [page?.id, setCurrentPage, updatePage]);
  
  if (!page || !category) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The documentation page you're looking for doesn't exist.
        </p>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </div>
    );
  }
  
  const categoryPages = pages
    .filter((p) => p.categoryId === category.id)
    .sort((a, b) => a.order - b.order);
    
  const currentPageIndex = categoryPages.findIndex((p) => p.id === page.id);
  const prevPage = currentPageIndex > 0 ? categoryPages[currentPageIndex - 1] : null;
  const nextPage = currentPageIndex < categoryPages.length - 1 ? categoryPages[currentPageIndex + 1] : null;
  
  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{page.title}</h1>
          {page.updatedAt && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
              <Calendar size={14} />
              <span>Last updated {formatDate(page.updatedAt)}</span>
            </div>
          )}
          <div className="text-xs text-muted-foreground mt-1">
            Views: {typeof page.views === "number" ? page.views : 0}
          </div>
        </div>
        
        {isAdmin && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/admin/edit/${page.id}`)}
          >
            <Edit size={16} className="mr-2" />
            Edit Page
          </Button>
        )}
      </div>
      
      <div className="prose dark:prose-invert">
        <ReactMarkdown>{page.content}</ReactMarkdown>
      </div>
      
      <div className="flex justify-between mt-12 pt-4 border-t">
        {prevPage ? (
          <Button variant="outline" onClick={() => navigate(`/docs/${category.slug}/${prevPage.slug}`)}>
            <ChevronLeft size={16} className="mr-2" />
            {prevPage.title}
          </Button>
        ) : (
          <div />
        )}
        
        {nextPage && (
          <Button variant="outline" onClick={() => navigate(`/docs/${category.slug}/${nextPage.slug}`)}>
            {nextPage.title}
            <ChevronRight size={16} className="ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
