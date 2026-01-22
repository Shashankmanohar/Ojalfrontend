import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Package, ArrowLeft, ImageIcon, LogOut, ShoppingBag, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminAuth } from '@/context/AdminAuthContext';
import adminService, { Product, ProductFormData } from '@/services/adminService';
import { toast } from '@/hooks/use-toast';

export default function Admin() {
  const { admin, adminLogout } = useAdminAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    category: '',
    subcategory: '',
    imageUrl: '',
    stock: 0,
    inStock: true,
    isNew: false,
    isBestseller: false,
  });

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchUsers();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await adminService.getProducts();
      setProducts(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await adminService.getOrders();
      setOrders(data);
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error: any) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSwitchChange = (name: keyof ProductFormData) => (checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setSelectedImages(fileArray);

      // Create preview for first image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(fileArray[0]);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      category: '',
      subcategory: '',
      imageUrl: '',
      stock: 0,
      inStock: true,
      isNew: false,
      isBestseller: false,
    });
    setEditingProduct(null);
    setSelectedImages([]);
    setImagePreview('');
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      originalPrice: product.originalPrice || 0,
      category: product.category,
      subcategory: product.subcategory || '',
      imageUrl: product.imageUrl || '',
      stock: (product as any).stock ?? (product.inStock ? 1 : 0),
      inStock: product.inStock ?? true,
      isNew: product.isNew ?? false,
      isBestseller: product.isBestseller ?? false,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Backend requires description (min 10 chars)
    const trimmedDescription = (formData.description || '').trim();
    if (trimmedDescription.length < 10) {
      toast({
        title: 'Error',
        description: 'Description is required (minimum 10 characters).',
        variant: 'destructive',
      });
      return;
    }

    // Backend requires category
    const trimmedCategory = (formData.category || '').trim();
    if (!trimmedCategory) {
      toast({
        title: 'Error',
        description: 'Category is required.',
        variant: 'destructive',
      });
      return;
    }

    // Validate stock
    if (formData.stock < 0) {
      toast({
        title: 'Error',
        description: 'Stock cannot be negative.',
        variant: 'destructive',
      });
      return;
    }

    // Validate images for new products
    if (!editingProduct && selectedImages.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one product image',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingProduct) {
        await adminService.updateProduct(editingProduct._id, formData, selectedImages.length > 0 ? selectedImages : undefined);
        toast({
          title: 'Success',
          description: 'Product updated successfully',
        });
      } else {
        await adminService.createProduct(formData, selectedImages);
        toast({
          title: 'Success',
          description: 'Product created successfully',
        });
      }
      fetchProducts();
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || `Failed to ${editingProduct ? 'update' : 'create'} product`,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await adminService.deleteProduct(id);
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
      fetchProducts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30 py-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Package className="text-primary" size={28} />
              <div>
                <h1 className="font-heading text-3xl font-bold">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">Welcome, {admin?.adminName}</p>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="products">
              <Package size={16} className="mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingBag size={16} className="mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users size={16} className="mr-2" />
              Users
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="bg-card rounded-xl shadow-soft p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-xl font-semibold">Products Management</h2>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) resetForm();
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus size={18} className="mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Product Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Category *</Label>
                          <Input
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={3}
                          required
                          minLength={10}
                        />
                      </div>

                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="price">Price *</Label>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={handleNumberChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="originalPrice">Original Price</Label>
                          <Input
                            id="originalPrice"
                            name="originalPrice"
                            type="number"
                            step="0.01"
                            value={formData.originalPrice}
                            onChange={handleNumberChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subcategory">Subcategory</Label>
                          <Input
                            id="subcategory"
                            name="subcategory"
                            value={formData.subcategory}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="stock">Stock *</Label>
                          <Input
                            id="stock"
                            name="stock"
                            type="number"
                            min={0}
                            value={formData.stock}
                            onChange={handleNumberChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="images">Product Images *</Label>
                        <Input
                          id="images"
                          name="images"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground">
                          Select up to 5 images. First image will be the main product image.
                        </p>
                        {imagePreview && (
                          <div className="mt-2">
                            <p className="text-sm font-medium mb-2">Preview:</p>
                            <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {selectedImages.length > 1 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                +{selectedImages.length - 1} more image(s)
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                          <Switch
                            id="inStock"
                            checked={formData.inStock}
                            onCheckedChange={handleSwitchChange('inStock')}
                          />
                          <Label htmlFor="inStock">In Stock</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            id="isNew"
                            checked={formData.isNew}
                            onCheckedChange={handleSwitchChange('isNew')}
                          />
                          <Label htmlFor="isNew">New Arrival</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            id="isBestseller"
                            checked={formData.isBestseller}
                            onCheckedChange={handleSwitchChange('isBestseller')}
                          />
                          <Label htmlFor="isBestseller">Bestseller</Label>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button type="submit" className="flex-1">
                          {editingProduct ? 'Update Product' : 'Add Product'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsDialogOpen(false);
                            resetForm();
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No products yet. Add your first product!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell>
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon size={20} className="text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>₹{product.price}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${product.inStock
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                                }`}
                            >
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(product)}
                              >
                                <Pencil size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDelete(product._id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="bg-card rounded-xl shadow-soft p-6">
              <h2 className="font-heading text-xl font-semibold mb-6">Orders Management</h2>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No orders yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell className="font-mono text-sm">{order._id.slice(-8)}</TableCell>
                          <TableCell>{order.user?.name || 'N/A'}</TableCell>
                          <TableCell>₹{order.totalAmount}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              {order.status}
                            </span>
                          </TableCell>
                          <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="bg-card rounded-xl shadow-soft p-6">
              <h2 className="font-heading text-xl font-semibold mb-6">Users Management</h2>
              {users.length === 0 ? (
                <div className="text-center py-12">
                  <Users size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No users yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                              {user.role}
                            </span>
                          </TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
