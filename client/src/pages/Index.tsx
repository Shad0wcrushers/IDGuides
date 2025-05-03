
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { MainLayout } from "../components/layout/MainLayout";
import { Search } from "../components/docs/Search";
import { useDocsContext } from "../context/DocsContext";
import React, { useRef } from "react";

const Index = () => {
  const { categories, pages } = useDocsContext();
  
  // Get featured or recent pages
  const featuredPages = pages
    .filter((page) => page.publishedAt)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Adjust based on card width
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  
  return (
    <MainLayout>
      <div className="flex-1">
        {/* Hero section */}
        <section className="bg-gradient-to-b from-doc-lightblue to-background py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Welcome to <span className="text-doc-blue">ID Guides</span>
            </h1>
            <p className="text-xl max-w-2xl mx-auto mb-10 text-muted-foreground">
              Your comprehensive guide to our hosting solutions and services.
              Find everything you need to maximize your experience.
            </p>
            
            <div className="max-w-lg mx-auto mb-10">
              <Search />
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/docs/getting-started/welcome">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#recent">Recent Articles</a>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Categories section */}
        <section id="categories" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Browse Documentation
            </h2>
            <div className="relative">
              {categories.length > 4 && (
                <>
                  {/* Left arrow */}
                  <button
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white dark:bg-doc-blue border border-doc-blue dark:border-white rounded-full shadow-lg transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-doc-blue"
                    onClick={() => scroll("left")}
                    aria-label="Scroll left"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <rect x="10" y="7" width="12" height="10" fill="currentColor" className="text-doc-blue dark:text-white"/>
                      <polygon points="10,2 2,12 10,22" fill="currentColor" className="text-doc-blue dark:text-white"/>
                    </svg>
                  </button>
                  {/* Right arrow */}
                  <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white dark:bg-doc-blue border border-doc-blue dark:border-white rounded-full shadow-lg transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-doc-blue"
                    onClick={() => scroll("right")}
                    aria-label="Scroll right"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="7" width="12" height="10" fill="currentColor" className="text-doc-blue dark:text-white"/>
                      <polygon points="14,2 22,12 14,22" fill="currentColor" className="text-doc-blue dark:text-white"/>
                    </svg>
                  </button>
                </>
              )}
              <div
                ref={scrollRef}
                className={`flex gap-6 overflow-x-auto scrollbar-hide py-2 ${categories.length > 6 ? "px-12" : ""}`}
                style={{ scrollBehavior: "smooth" }}
              >
                {categories
                  .sort((a, b) => a.order - b.order)
                  .map((category) => {
                    const categoryPages = pages.filter((p) => p.categoryId === category.id);

                    return (
                      <div
                        key={category.id}
                        className="min-w-[320px] max-w-xs flex-shrink-0 border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="p-6">
                          <h3 className="text-xl font-semibold mb-2">
                            {category.title}
                          </h3>
                          <p className="text-muted-foreground mb-4 min-h-[48px]">
                            {category.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              {categoryPages.length} article{categoryPages.length !== 1 ? "s" : ""}
                            </span>
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/docs/${category.slug}/${categoryPages[0]?.slug || ""}`}>
                                Browse
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </section>
        
        {/* Recent articles section */}
        <section id="recent" className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Recent Articles
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredPages.map((page) => {
                const category = categories.find((c) => c.id === page.categoryId);
                
                return (
                  <div
                    key={page.id}
                    className="bg-background border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="mb-2">
                        <span className="text-sm font-medium text-doc-blue">
                          {category?.title || "Uncategorized"}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{page.title}</h3>
                      <p className="text-muted-foreground mb-4">
                        {page.excerpt || ""}
                      </p>
                      <Button variant="link" className="p-0" asChild>
                        <Link to={`/docs/${category?.slug || ""}/${page.slug}`}>
                          Read More
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        
        {/* CTA section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Need More Help?
            </h2>
            <p className="text-xl max-w-2xl mx-auto mb-8 text-muted-foreground">
              Our support team is ready to assist you with any questions or issues.
            </p>
            <Button size="lg" asChild>
              <a href="https://client.idhosting.dk/submitticket.php?step=2&deptid=2" target="_blank" rel="noopener noreferrer">
                Contact Support
              </a>
            </Button>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
