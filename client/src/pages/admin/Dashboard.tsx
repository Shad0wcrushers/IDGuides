
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useDocsContext } from "../../context/DocsContext";
import { FileText, FolderOpen, Users } from "lucide-react";
import { DocPage, Category } from "../../../types/docs"; // <-- Add this import

const Dashboard = () => {
  const { pages, categories, updatePage, resetAllViews } = useDocsContext();
  const [viewedPage, setViewedPage] = useState<{page: DocPage, category: Category | undefined} | null>(null);
  const [refresh, setRefresh] = useState(0);
  
  const stats = [
    {
      label: "Total Pages",
      value: pages.length,
      icon: FileText,
      link: "/admin/pages",
    },
    {
      label: "Categories",
      value: categories.length,
      icon: FolderOpen,
      link: "/admin/categories",
    },
    {
      label: "Users",
      value: 2, // Mock value
      icon: Users,
      link: "/admin/users",
    },
  ];
  
  // Get recently updated pages
  const recentPages = [...pages]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  // Handler to increment views and navigate
  const handleViewPage = (page, category) => {
    updatePage(page.id, { views: (page.views ?? 0) + 1 });
    setViewedPage({ page, category });
    setRefresh(r => r + 1); // force re-render
  };

  // Ensure all pages have a view count
  const pagesWithViews = pages.map(page => ({
    ...page,
    views: typeof page.views === "number" ? page.views : 0
  }));

  // Find the highest view count
  const maxViews = pagesWithViews.reduce((max, page) => Math.max(max, page.views), 0);

  // Get only the top 2 pages with the highest view count (regardless of ties)
  const mostViewedPages = pagesWithViews
    .filter(page => page.views > 0)
    .sort((a, b) => b.views - a.views || b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 2);


  useEffect(() => {
    if (viewedPage) {
      window.open(`/docs/${viewedPage.category?.slug || ""}/${viewedPage.page.slug}`, "_blank");
      setViewedPage(null);
    }
  }, [viewedPage]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/admin/pages/create">Create New Page</Link>
          </Button>
          <Button variant="destructive" onClick={resetAllViews}>
            Reset All Views
          </Button>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <Button variant="link" className="p-0 h-auto" asChild>
                <Link to={stat.link}>View all</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Most Viewed Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Most Viewed Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mostViewedPages.map((page) => {
              const category = categories.find((c) => c.id === page.categoryId);
              return (
                <div
                  key={page.id}
                  className="flex justify-between items-center p-3 border rounded-md"
                >
                  <div>
                    <p className="font-medium">{page.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {category?.title || "Uncategorized"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Views: {page.views || 0}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewPage(page, category)}
                    >
                      View
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/edit/${page.id}`}>Edit</Link>
                    </Button>
                  </div>
                </div>
              );
            })}
            {mostViewedPages.length === 0 && (
              <div className="text-center text-muted-foreground">No articles found</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent pages */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Updated Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentPages.map((page) => {
              const category = categories.find((c) => c.id === page.categoryId);
              return (
                <div
                  key={page.id}
                  className="flex justify-between items-center p-3 border rounded-md"
                >
                  <div>
                    <p className="font-medium">{page.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {category?.title || "Uncategorized"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Views: {typeof page.views === "number" ? page.views : 0}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/docs/${category?.slug || ""}/${page.slug}`}>View</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/edit/${page.id}`}>Edit</Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
