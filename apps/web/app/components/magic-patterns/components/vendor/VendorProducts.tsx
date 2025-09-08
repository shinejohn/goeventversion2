'use client';

import React, { useState } from 'react';
import { useNavigate, useSearchParams, Form } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { Label } from '@kit/ui/label';
import { Badge } from '@kit/ui/badge';
import { Checkbox } from '@kit/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@kit/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@kit/ui/tabs';
import { 
  Package, 
  Plus, 
  Search,
  Filter,
  Edit,
  Trash2,
  Copy,
  Eye,
  Star,
  AlertCircle,
  Download,
  Upload
} from 'lucide-react';
import { cn } from '@kit/ui/cn';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  inventoryCount: number;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isSale: boolean;
  rating: number;
  reviewCount: number;
  viewCount: number;
  purchaseCount: number;
  imageUrl: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface VendorProductsProps {
  vendor: {
    id: string;
    businessName: string;
    status: string;
  };
  products: Product[];
  stats: {
    totalProducts: number;
    activeProducts: number;
    outOfStock: number;
    lowStock: number;
  };
  categories: string[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    search: string;
    category: string;
    status: string;
    sort: string;
  };
}

export function VendorProducts({
  vendor,
  products,
  stats,
  categories,
  pagination,
  filters
}: VendorProductsProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState('');

  const handleProductToggle = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === products.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(products.map(p => p.id)));
    }
  };

  const handleBulkAction = () => {
    if (!bulkAction || selectedProducts.size === 0) return;
    // Handle bulk action
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    setSearchParams(prev => {
      if (search) {
        prev.set('search', search);
      } else {
        prev.delete('search');
      }
      prev.set('page', '1');
      return prev;
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/dashboard/vendor/products/export" download>
              <Download className="w-4 h-4 mr-2" />
              Export
            </a>
          </Button>
          <Button asChild>
            <Form method="get" action="/dashboard/vendor/products/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Form>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.lowStock}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-sm">
              <Input
                name="search"
                placeholder="Search products..."
                defaultValue={filters.search}
                className="flex-1"
              />
              <Button type="submit" variant="outline">
                <Search className="w-4 h-4" />
              </Button>
            </form>

            <div className="flex gap-2">
              <Select
                value={filters.category}
                onValueChange={(value) => {
                  setSearchParams(prev => {
                    if (value === 'all') {
                      prev.delete('category');
                    } else {
                      prev.set('category', value);
                    }
                    prev.set('page', '1');
                    return prev;
                  });
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.status}
                onValueChange={(value) => {
                  setSearchParams(prev => {
                    if (value === 'all') {
                      prev.delete('status');
                    } else {
                      prev.set('status', value);
                    }
                    prev.set('page', '1');
                    return prev;
                  });
                }}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.sort}
                onValueChange={(value) => {
                  setSearchParams(prev => {
                    prev.set('sort', value);
                    return prev;
                  });
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="created">Date Added</SelectItem>
                  <SelectItem value="sales">Best Selling</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selectedProducts.size > 0 && (
            <div className="mb-4 p-4 bg-muted rounded-lg flex items-center justify-between">
              <p className="text-sm">{selectedProducts.size} products selected</p>
              <div className="flex gap-2">
                <Select value={bulkAction} onValueChange={setBulkAction}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Bulk actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activate">Activate</SelectItem>
                    <SelectItem value="deactivate">Deactivate</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                    <SelectItem value="export">Export</SelectItem>
                  </SelectContent>
                </Select>
                <Form method="post" action="/dashboard/vendor/products/bulk">
                  <input type="hidden" name="_action" value={bulkAction} />
                  <input type="hidden" name="ids" value={Array.from(selectedProducts).join(',')} />
                  <Button type="submit" variant="outline" onClick={handleBulkAction}>
                    Apply
                  </Button>
                </Form>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">
                    <Checkbox
                      checked={selectedProducts.size === products.length && products.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left p-2">Product</th>
                  <th className="text-left p-2">SKU</th>
                  <th className="text-right p-2">Price</th>
                  <th className="text-right p-2">Stock</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-center p-2">Rating</th>
                  <th className="text-right p-2">Sales</th>
                  <th className="text-right p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-muted-foreground">
                      No products found. Create your first product to get started.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        <Checkbox
                          checked={selectedProducts.has(product.id)}
                          onCheckedChange={() => handleProductToggle(product.id)}
                        />
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium line-clamp-1">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-2 text-sm">{product.sku}</td>
                      <td className="p-2 text-right">
                        <div>
                          ${product.price.toFixed(2)}
                          {product.compareAtPrice && (
                            <p className="text-sm text-muted-foreground line-through">
                              ${product.compareAtPrice.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-2 text-right">
                        <span className={cn(
                          "font-medium",
                          product.inventoryCount === 0 && "text-red-600",
                          product.inventoryCount > 0 && product.inventoryCount <= 10 && "text-amber-600"
                        )}>
                          {product.inventoryCount}
                        </span>
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          {product.isActive ? (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                          {product.isFeatured && <Badge>Featured</Badge>}
                          {product.isNew && <Badge variant="outline">New</Badge>}
                          {product.isSale && <Badge variant="destructive">Sale</Badge>}
                        </div>
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">
                            {product.rating.toFixed(1)} ({product.reviewCount})
                          </span>
                        </div>
                      </td>
                      <td className="p-2 text-right">{product.purchaseCount}</td>
                      <td className="p-2">
                        <div className="flex justify-end gap-2">
                          <Form method="get" action={`/dashboard/vendor/products/${product.id}/edit`}>
                            <Button type="submit" variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Form>
                          <Form method="post" action={`/dashboard/vendor/products/${product.id}/duplicate`}>
                            <input type="hidden" name="_action" value="duplicate" />
                            <Button type="submit" variant="ghost" size="sm">
                              <Copy className="w-4 h-4" />
                            </Button>
                          </Form>
                          <Form 
                            method="post" 
                            action="/dashboard/vendor/products"
                            onSubmit={(e) => {
                              if (!confirm('Are you sure you want to delete this product?')) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <input type="hidden" name="_action" value="delete" />
                            <input type="hidden" name="id" value={product.id} />
                            <Button type="submit" variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </Form>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={pagination.page === 1}
                onClick={() => {
                  setSearchParams(prev => {
                    prev.set('page', String(pagination.page - 1));
                    return prev;
                  });
                }}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => {
                  setSearchParams(prev => {
                    prev.set('page', String(pagination.page + 1));
                    return prev;
                  });
                }}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}