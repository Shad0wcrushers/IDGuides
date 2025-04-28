import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDocsContext } from "@/context/DocsContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import { slugify } from "@/lib/utils";
import { DocPage } from "@/types/docs";
import { ImagePlus } from "lucide-react";

interface PageEditorProps {
  isNewPage?: boolean;
}

export function PageEditor({ isNewPage = false }: PageEditorProps) {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const { pages, categories, addPage, updatePage } = useDocsContext();
  
  const [activeTab, setActiveTab] = useState<string>("edit");
  const [pageData, setPageData] = useState<Partial<DocPage>>({
    title: "",
    slug: "",
    content: "",
    categoryId: "",
    order: 1,
    excerpt: "",
    author: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageUploading, setImageUploading] = useState(false);
  
  useEffect(() => {
    if (!isNewPage && pageId) {
      const page = pages.find((p) => p.id === pageId);
      if (page) {
        setPageData(page);
      } else {
        navigate("/admin/pages");
      }
    }
  }, [isNewPage, pageId, pages, navigate]);
  
  useEffect(() => {
    if (!pageData.slug || (pageData.slug === slugify(pageData.title || ""))) {
      setPageData((prev) => ({
        ...prev,
        slug: slugify(prev.title || ""),
      }));
    }
  }, [pageData.title]);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPageData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setPageData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!pageData.title?.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!pageData.slug?.trim()) {
      newErrors.slug = "Slug is required";
    }
    
    if (!pageData.categoryId) {
      newErrors.categoryId = "Category is required";
    }
    
    if (!pageData.content?.trim()) {
      newErrors.content = "Content is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      if (isNewPage) {
        addPage({
          title: pageData.title || "",
          slug: pageData.slug || "",
          content: pageData.content || "",
          categoryId: pageData.categoryId || "",
          order: pageData.order || 1,
          excerpt: pageData.excerpt,
          author: pageData.author,
        });
      } else if (pageId) {
        updatePage(pageId, pageData);
      }
      
      navigate("/admin/pages");
    } catch (error) {
      console.error("Failed to save page:", error);
    }
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    
    try {
      const imageUrl = URL.createObjectURL(file);
      
      const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
      const imageMarkdown = `\n![${file.name}](${imageUrl})\n`;
      
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        
        const newContent = text.substring(0, start) + imageMarkdown + text.substring(end);
        
        setPageData(prev => ({
          ...prev,
          content: newContent
        }));
      } else {
        setPageData(prev => ({
          ...prev,
          content: (prev.content || "") + imageMarkdown
        }));
      }
      
      if (errors.content) {
        setErrors(prev => ({ ...prev, content: "" }));
      }
    } catch (error) {
      console.error("Failed to handle image:", error);
    } finally {
      setImageUploading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          {isNewPage ? "Create New Page" : "Edit Page"}
        </h1>
        
        <div className="space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/admin/pages")}
          >
            Cancel
          </Button>
          <Button type="submit">
            {isNewPage ? "Create Page" : "Save Changes"}
          </Button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Content</CardTitle>
              <CardDescription>
                Create or edit your documentation page content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={pageData.title || ""}
                    onChange={handleChange}
                    placeholder="Page title"
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      /docs/category/
                    </span>
                    <Input
                      id="slug"
                      name="slug"
                      value={pageData.slug || ""}
                      onChange={handleChange}
                      placeholder="page-slug"
                      className="flex-1"
                    />
                  </div>
                  {errors.slug && (
                    <p className="text-sm text-destructive">{errors.slug}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Input
                    id="excerpt"
                    name="excerpt"
                    value={pageData.excerpt || ""}
                    onChange={handleChange}
                    placeholder="Short description of the page"
                  />
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
                  <TabsList className="flex justify-between">
                    <div className="flex">
                      <TabsTrigger value="edit">Edit</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </div>
                    <div className="flex items-center">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={imageUploading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={imageUploading}
                        onClick={() => document.getElementById('image-upload')?.click()}
                      >
                        <ImagePlus className="h-4 w-4 mr-2" />
                        Add Image
                      </Button>
                    </div>
                  </TabsList>
                  
                  <TabsContent value="edit" className="p-0">
                    <Textarea
                      id="content"
                      name="content"
                      value={pageData.content || ""}
                      onChange={handleChange}
                      placeholder="# Write your content here using Markdown"
                      className="min-h-[400px] font-mono"
                    />
                    {errors.content && (
                      <p className="text-sm text-destructive mt-2">{errors.content}</p>
                    )}
                  </TabsContent>
                  <TabsContent value="preview" className="p-0">
                    <div className="border rounded-md p-4 min-h-[400px] prose dark:prose-invert">
                      {pageData.content ? (
                        <ReactMarkdown>{pageData.content}</ReactMarkdown>
                      ) : (
                        <p className="text-muted-foreground">
                          No content to preview
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={pageData.categoryId || ""}
                  onValueChange={(value) => handleSelectChange("categoryId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-sm text-destructive">{errors.categoryId}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  name="order"
                  type="number"
                  min="1"
                  value={pageData.order || 1}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  name="author"
                  value={pageData.author || ""}
                  onChange={handleChange}
                  placeholder="Page author"
                />
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              {!isNewPage && (
                <Button type="button" variant="outline">
                  Preview
                </Button>
              )}
              <Button type="submit">
                {isNewPage ? "Create" : "Save"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </form>
  );
}