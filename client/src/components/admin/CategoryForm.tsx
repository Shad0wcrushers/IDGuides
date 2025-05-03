
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { useDocsContext } from "../../context/DocsContext";
import { slugify } from "../../lib/utils";
import { Category } from "../../../types/docs";

interface CategoryFormProps {
  categoryId?: string;
  onSuccess?: () => void;
}

export function CategoryForm({ categoryId, onSuccess }: CategoryFormProps) {
  const navigate = useNavigate();
  const { categories, addCategory, updateCategory } = useDocsContext();
  
  const [formData, setFormData] = useState<Partial<Category>>({
    title: "",
    slug: "",
    description: "",
    order: categories.length + 1,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Load category data if editing
  useEffect(() => {
    if (categoryId) {
      const category = categories.find((c) => c.id === categoryId);
      if (category) {
        setFormData(category);
      }
    }
  }, [categoryId, categories]);
  
  // Update slug when title changes
  useEffect(() => {
    if (!formData.slug || formData.slug === slugify(formData.title || "")) {
      setFormData((prev) => ({
        ...prev,
        slug: slugify(prev.title || ""),
      }));
    }
  }, [formData.title]);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.slug?.trim()) {
      newErrors.slug = "Slug is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    if (categoryId) {
      updateCategory(categoryId, formData);
    } else {
      addCategory({
        title: formData.title || "",
        slug: formData.slug || "",
        order: formData.order || 1,
        description: formData.description,
      });
    }
    
    if (onSuccess) {
      onSuccess();
    } else {
      navigate("/admin/categories");
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title || ""}
          onChange={handleChange}
          placeholder="Category title"
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">/docs/</span>
          <Input
            id="slug"
            name="slug"
            value={formData.slug || ""}
            onChange={handleChange}
            placeholder="category-slug"
            className="flex-1"
          />
        </div>
        {errors.slug && (
          <p className="text-sm text-destructive">{errors.slug}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          placeholder="Category description"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="order">Display Order</Label>
        <Input
          id="order"
          name="order"
          type="number"
          min="1"
          value={formData.order || 1}
          onChange={handleChange}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/admin/categories")}
        >
          Cancel
        </Button>
        <Button type="submit">
          {categoryId ? "Save Changes" : "Create Category"}
        </Button>
      </div>
    </form>
  );
}
