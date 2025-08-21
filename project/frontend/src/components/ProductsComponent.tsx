import React, { useState, useEffect } from "react";
import {
  productService,
  handleApiError,
  type Product,
  type ProductData,
} from "../api/services";

const ProductsComponent: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newProduct, setNewProduct] = useState<ProductData>({
    name: "",
    description: "",
    owner_id: 1, // You'll need to get this from user context/auth
  });

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const productsData = await productService.getProducts();
      setProducts(productsData);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const createdProduct = await productService.addProduct(newProduct);
      setProducts((prev) => [...prev, createdProduct]);
      setNewProduct({ name: "", description: "", owner_id: 1 });
      setShowAddForm(false);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Products</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium transition-all duration-200 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          disabled={loading}
        >
          {showAddForm ? "Cancel" : "Add Product"}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <form onSubmit={handleAddProduct} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Product</h3>
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                rows={3}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="owner_id" className="block text-sm font-medium text-gray-700">
                Owner ID:
              </label>
              <input
                type="number"
                id="owner_id"
                name="owner_id"
                value={newProduct.owner_id}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>
          </form>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {loading && !showAddForm && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading products...</span>
          </div>
        )}

        {products.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">No products found</p>
            <p className="text-sm">Add your first product to get started!</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Owner: {product.owner}</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  ID: {product.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsComponent;
