
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useDocsContext } from "@/context/DocsContext";
import { Search as SearchIcon } from "lucide-react";

export function Search() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { categories, pages } = useDocsContext();
  
  const handleSelectPage = (categorySlug: string, pageSlug: string) => {
    navigate(`/docs/${categorySlug}/${pageSlug}`);
    setOpen(false);
  };
  
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  
  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-lg text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search documentation...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search documentation..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {categories.map((category) => {
            const categoryPages = pages.filter((p) => p.categoryId === category.id);
            
            return (
              <CommandGroup key={category.id} heading={category.title}>
                {categoryPages.map((page) => (
                  <CommandItem
                    key={page.id}
                    onSelect={() => handleSelectPage(category.slug, page.slug)}
                  >
                    {page.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
