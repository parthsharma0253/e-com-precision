/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Precision Commerce - Main Frontend State Controller
 * 
 * Welcome to React! Since you are new to frontend engineering, this file is fully annotated
 * to explain how React state, props, server communication (fetches), and component lifecycle work.
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductForm from './components/ProductForm';
import OrdersTab from './components/OrdersTab';
import ApiConsole from './components/ApiConsole';
import DevDocs from './components/DevDocs';
import { X, ShoppingCart, Tag, Calendar } from 'lucide-react';

// Import our TypeScript schemas & pre-seeded catalog data
import { Product, OrderResponse, ApiLog, OrderRequest } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './data/mockData';

export default function App() {
  
  // ==========================================
  // 1. REACT STATE DECLARATIONS
  // State is data that can change in the app. When state changes,
  // React automatically re-renders the visual components on the screen!
  // ==========================================
  
  // Navigation tabs: 'home' is catalog view, 'add-product' is form view, 'orders' is dashboard, 'dev-guide' is instructions
  const [currentTab, setCurrentTab] = useState<'home' | 'add-product' | 'orders' | 'dev-guide'>('home');
  
  // Connection parameters: Toggle between mock offline demo and live local Spring Boot endpoints
  const [isMockMode, setIsMockMode] = useState<boolean>(true);
  const [apiBaseUrl, setApiBaseUrl] = useState<string>('http://localhost:8081');

  // Core collections
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<OrderResponse[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [apiLogs, setApiLogs] = useState<ApiLog[]>([]);

  // Filtering & Sorting UI values
  const [activeCategory, setActiveCategory] = useState<string>('All Products');
  const [sortOption, setSortOption] = useState<string>('Featured');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  
  // Pagination page tracking (displays 3 items per page for realistic pagination mockups)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6; // Set to 6 to display all pre-seeded items beautifully, or let page click cycle

  // Editing state - Holds a Product object if we clicked Edit (PUT), otherwise null (POST)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Active viewing product details (GET /product/{productId})
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  // ==========================================
  // 2. LOG TRANSACTIONS HELPER
  // Appends details of HTTP communications into the live dashboard inspector.
  // ==========================================
  const addApiLog = (
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    requestBody: any,
    responseStatus: number,
    responseBody: any
  ) => {
    const newLog: ApiLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      method,
      url: `${apiBaseUrl}${endpoint}`,
      requestBody,
      responseStatus,
      responseBody,
      isMock: isMockMode
    };
    // Prepend the new log to the top of our console log history array
    setApiLogs(prev => [newLog, ...prev]);
  };

  // ==========================================
  // 3. SERVER INTEGRATIONS (FETCH RUNNERS)
  // These implement the real endpoints from your Spring Boot OpenAPI document!
  // ==========================================

  /**
   * GET /hello - Basic health check / greeting endpoint
   */
  const triggerHelloGreeting = async () => {
    if (isMockMode) {
      addApiLog('GET', '/hello', null, 200, "Hello, Welcome to Precision Commerce Spring Boot backend!");
      alert("Mock Hello Greet Response: \"Hello, Welcome to Precision Commerce Spring Boot backend!\"");
      return;
    }

    try {
      const res = await fetch(`${apiBaseUrl}/hello`);
      const text = await res.text();
      addApiLog('GET', '/hello', null, res.status, text);
      alert(`Spring Boot Response: "${text}"`);
    } catch (err) {
      console.error(err);
      addApiLog('GET', '/hello', null, 500, { error: "Network connection refused. Is Spring Boot running with CORS enabled on http://localhost:8081?" });
      alert("Failed to connect to local Spring Boot. Ensure it is active or toggle Mock Mode to continue offline.");
    }
  };

  /**
   * GET /api/products - Refresh all products list
   */
  const fetchAllProducts = async () => {
    if (isMockMode) {
      // In mock mode, we use local state
      addApiLog('GET', '/api/products', null, 200, products);
      return;
    }

    try {
      const res = await fetch(`${apiBaseUrl}/api/products`);
      if (!res.ok) throw new Error("Could not retrieve products list");
      const data: Product[] = await res.json();
      setProducts(data);
      addApiLog('GET', '/api/products', null, res.status, data);
    } catch (err: any) {
      console.error(err);
      addApiLog('GET', '/api/products', null, 500, { error: err.message || "Failed to contact Spring Boot server." });
    }
  };

  /**
   * GET /api/products/search?keyword={keyword} - Filters products by name/description
   */
  const fetchProductsByKeyword = async (keyword: string) => {
    if (isMockMode) {
      // Search offline mockup filter
      const filtered = INITIAL_PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(keyword.toLowerCase()) || 
        p.description.toLowerCase().includes(keyword.toLowerCase()) ||
        p.brand.toLowerCase().includes(keyword.toLowerCase())
      );
      setProducts(filtered);
      addApiLog('GET', `/api/products/search?keyword=${keyword}`, null, 200, filtered);
      return;
    }

    try {
      const res = await fetch(`${apiBaseUrl}/api/products/search?keyword=${encodeURIComponent(keyword)}`);
      if (!res.ok) throw new Error("Search request failed");
      const data: Product[] = await res.json();
      setProducts(data);
      addApiLog('GET', `/api/products/search?keyword=${keyword}`, null, res.status, data);
    } catch (err: any) {
      console.error(err);
      addApiLog('GET', `/api/products/search?keyword=${keyword}`, null, 500, { error: err.message || "Search failed." });
    }
  };

  /**
   * GET /api/orders - Fetches list of all placed orders
   */
  const fetchAllOrders = async () => {
    if (isMockMode) {
      addApiLog('GET', '/api/orders', null, 200, orders);
      return;
    }

    try {
      const res = await fetch(`${apiBaseUrl}/api/orders`);
      if (!res.ok) throw new Error("Could not retrieve order database logs");
      const data: OrderResponse[] = await res.json();
      setOrders(data);
      addApiLog('GET', '/api/orders', null, res.status, data);
    } catch (err: any) {
      console.error(err);
      addApiLog('GET', '/api/orders', null, 500, { error: err.message || "Failed to contact order system." });
    }
  };

  /**
   * POST /api/orders/place - Places a new customer order
   */
  const handlePlaceOrder = async (customerName: string, email: string) => {
    // Generate the order items structure from our cart state
    const orderItemsRequest = cart.map(item => ({
      productId: item.product.id || 0,
      quantity: item.quantity
    }));

    const orderPayload: OrderRequest = {
      customerName,
      email,
      items: orderItemsRequest
    };

    if (isMockMode) {
      // Simulate order processing locally
      const mockResponseItems = cart.map(item => ({
        productName: item.product.name,
        quantity: item.quantity,
        totalPrice: item.product.price * item.quantity
      }));

      const mockOrderResponse: OrderResponse = {
        orderId: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        customerName,
        email,
        status: "PENDING",
        orderDate: new Date().toISOString().split('T')[0],
        items: mockResponseItems
      };

      // Add to mock orders
      setOrders(prev => [mockOrderResponse, ...prev]);
      setCart([]); // Reset shopping cart
      addApiLog('POST', '/api/orders/place', orderPayload, 200, mockOrderResponse);
      return;
    }

    try {
      const res = await fetch(`${apiBaseUrl}/api/orders/place`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      if (!res.ok) throw new Error("Checkout failed inside Spring Boot");
      const savedOrder: OrderResponse = await res.json();
      
      setOrders(prev => [savedOrder, ...prev]);
      setCart([]);
      addApiLog('POST', '/api/orders/place', orderPayload, 200, savedOrder);
    } catch (err: any) {
      console.error(err);
      addApiLog('POST', '/api/orders/place', orderPayload, 500, { error: err.message });
      throw err;
    }
  };

  /**
   * POST /api/product & PUT /api/product/{id}
   * This is our core save logic! It correctly packages the product details (JSON)
   * alongside the uploaded binary image file (File) into a multipart/form-data container!
   */
  const handleSaveProduct = async (product: Product, imageFile: File | null) => {
    if (isMockMode) {
      // Offline mockup save
      if (product.id) {
        // Edit mode (PUT equivalent)
        setProducts(prev => prev.map(p => p.id === product.id ? product : p));
        addApiLog('PUT', `/api/product/${product.id}`, { product, imageFileName: imageFile?.name || 'retained' }, 200, { status: "OK", id: product.id });
      } else {
        // Add mode (POST equivalent)
        const newProd: Product = {
          ...product,
          id: Math.floor(100 + Math.random() * 900),
          isNewBadge: true
        };
        setProducts(prev => [newProd, ...prev]);
        addApiLog('POST', '/api/product', { product, imageFileName: imageFile?.name || 'none' }, 200, { status: "OK", id: newProd.id });
      }
      setCurrentTab('home');
      setEditingProduct(null);
      return;
    }

    try {
      // Prepare Multipart payload
      const formData = new FormData();
      
      const cleanProduct = { ...product };
      if (cleanProduct.imageData) {
        if (cleanProduct.imageData.startsWith('http')) {
          delete cleanProduct.imageData;
        } else {
          // Extract pure base64 data to avoid Spring Boot base64 deserialization errors
          let base64Str = cleanProduct.imageData;
          const base64Marker = 'base64,';
          const markerIndex = base64Str.indexOf(base64Marker);
          if (markerIndex !== -1) {
            base64Str = base64Str.substring(markerIndex + base64Marker.length);
          } else {
            const base64AltMarker = 'base64';
            const altMarkerIndex = base64Str.indexOf(base64AltMarker);
            if (altMarkerIndex !== -1) {
              base64Str = base64Str.substring(altMarkerIndex + base64AltMarker.length);
              if (base64Str.startsWith(',') || base64Str.startsWith(';')) {
                base64Str = base64Str.substring(1);
              }
            }
          }
          cleanProduct.imageData = base64Str.trim();
        }
      }

      let url = `${apiBaseUrl}/api/product`;
      let method: 'POST' | 'PUT' = 'POST';

      if (product.id) {
        url = `${apiBaseUrl}/api/product/${product.id}`;
        method = 'PUT';
      }

      // Append the product attributes as a JSON blob so Spring's @RequestPart resolves it!
      const productBlob = new Blob([JSON.stringify(cleanProduct)], { type: 'application/json' });
      formData.append('product', productBlob);

      // Append the image file binary stream
      if (imageFile) {
        formData.append('imageFile', imageFile);
      } else if (method === 'POST') {
        // Spring Boot expects this parameter on creation; append an empty placeholder if none was selected
        const emptyBlob = new Blob([''], { type: 'image/jpeg' });
        formData.append('imageFile', emptyBlob, 'product.jpg');
      }

      const res = await fetch(url, {
        method,
        body: formData // No headers needed, the browser assigns multipart/form-data automatically!
      });

      if (!res.ok) throw new Error("Could not save product package successfully");
      
      let responseData: any = null;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          responseData = await res.json();
        } catch (e) {
          responseData = { message: "Successfully executed" };
        }
      } else {
        const text = await res.text();
        responseData = { message: text || "Successfully executed" };
      }

      addApiLog(method, product.id ? `/api/product/${product.id}` : '/api/product', { product: cleanProduct, hasImageFile: !!imageFile }, res.status, responseData);
      
      // Refresh local product list
      fetchAllProducts();
      setCurrentTab('home');
      setEditingProduct(null);
    } catch (err: any) {
      console.error(err);
      addApiLog(product.id ? 'PUT' : 'POST', product.id ? `/api/product/${product.id}` : '/api/product', product, 500, { error: err.message });
      alert(`Save failed: ${err.message}. Ensure your local Spring Boot backend accepts these fields.`);
    }
  };

  /**
   * GET /product/{productId} - Fetches detailed data for an individual product
   */
  const handleViewProductDetails = async (productId: number) => {
    if (isMockMode) {
      const mockProd = products.find(p => p.id === productId);
      if (mockProd) {
        setViewingProduct(mockProd);
        addApiLog('GET', `/product/${productId}`, null, 200, mockProd);
      } else {
        alert("Product not found");
      }
      return;
    }

    try {
      // Fetch details from the designated /product/{productId} endpoint
      const url = `${apiBaseUrl}/product/${productId}`;
      const res = await fetch(url);
      
      if (!res.ok) {
        // Safe fallback to /api/product/{productId} if Spring Boot maps it under standard api prefix
        const fallbackUrl = `${apiBaseUrl}/api/product/${productId}`;
        const fallbackRes = await fetch(fallbackUrl);
        if (!fallbackRes.ok) {
          throw new Error(`Failed to fetch product details from either /product/${productId} or /api/product/${productId}`);
        }
        const data: Product = await fallbackRes.json();
        setViewingProduct(data);
        addApiLog('GET', `/api/product/${productId}`, null, fallbackRes.status, data);
        return;
      }

      const data: Product = await res.json();
      setViewingProduct(data);
      addApiLog('GET', `/product/${productId}`, null, res.status, data);
    } catch (err: any) {
      console.error(err);
      addApiLog('GET', `/product/${productId}`, null, 500, { error: err.message });
      
      // Keep UI functional by falling back to local state if backend fetch fails
      const localProd = products.find(p => p.id === productId);
      if (localProd) {
        setViewingProduct(localProd);
      } else {
        alert(`Failed to retrieve product details: ${err.message}`);
      }
    }
  };

  /**
   * DELETE /api/product/{productId} - Deletes a product from database
   */
  const handleDeleteProduct = async (productId: number) => {
    if (isMockMode) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      setCart(prev => prev.filter(item => item.product.id !== productId));
      addApiLog('DELETE', `/api/product/${productId}`, null, 200, `Product with ID ${productId} deleted successfully.`);
      return;
    }

    try {
      const res = await fetch(`${apiBaseUrl}/api/product/${productId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error("Failed to delete product from server");
      
      addApiLog('DELETE', `/api/product/${productId}`, null, res.status, `Product ${productId} removed.`);
      
      // Reload products list
      fetchAllProducts();
    } catch (err: any) {
      console.error(err);
      addApiLog('DELETE', `/api/product/${productId}`, null, 500, { error: err.message });
      alert(`Deletion failed: ${err.message}`);
    }
  };

  // ==========================================
  // 4. REACT HOOKS (EFFECTS)
  // useEffect runs specific blocks of code automatically at key lifecycle points,
  // like when the page finishes rendering or when connection mode toggles.
  // ==========================================
  
  // On startup & whenever backend connection toggles, refresh product and order arrays
  useEffect(() => {
    fetchAllProducts();
    fetchAllOrders();
  }, [isMockMode, apiBaseUrl]);

  // ==========================================
  // 5. INTERACTIVE CART CONTROLLER METHODS
  // ==========================================
  
  const handleAddToCart = (product: Product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.product.id === product.id);
      if (existing) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Quick order status toggling helper for dashboard fun
  const handleToggleOrderStatus = (orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.orderId === orderId) {
        const nextStatus = order.status === "PENDING" ? "COMPLETED" : "PENDING";
        addApiLog('POST', `/api/orders/update-status/${orderId}`, { nextStatus }, 200, { orderId, status: nextStatus });
        return { ...order, status: nextStatus };
      }
      return order;
    }));
  };

  const handleTriggerEdit = (product: Product) => {
    setEditingProduct(product);
    setCurrentTab('add-product');
  };

  const handleTriggerShopAll = () => {
    setActiveCategory('All Products');
    setSearchKeyword('');
    fetchAllProducts();
    setCurrentTab('home');
  };

  // ==========================================
  // 6. SORTING, FILTERING & PAGINATION CALCULATIONS
  // ==========================================
  
  // 1. Apply category filter
  const filteredProducts = products.filter(p => {
    if (activeCategory === 'All Products') return true;
    return p.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  // 2. Apply sorting options
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'Price: Low to High') {
      return a.price - b.price;
    }
    if (sortOption === 'Price: High to Low') {
      return b.price - a.price;
    }
    if (sortOption === 'Stock Quantity') {
      return b.stockQuantity - a.stockQuantity;
    }
    // Default 'Featured' / ID sort
    return (b.id || 0) - (a.id || 0);
  });

  // 3. Slice page lists for pagination display
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-600 selection:text-white pb-72">
      
      {/* 1. Brand Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'add-product') setEditingProduct(null);
          if (tab === 'home') {
            setSearchKeyword('');
            fetchAllProducts();
            setActiveCategory('All Products');
            setCurrentPage(1);
          }
        }}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        onSearchSubmit={fetchProductsByKeyword}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        cartItems={cart}
        onCheckout={handlePlaceOrder}
        onClearCart={handleClearCart}
        isMockMode={isMockMode}
        setIsMockMode={setIsMockMode}
        apiBaseUrl={apiBaseUrl}
        setApiBaseUrl={setApiBaseUrl}
      />

      {/* 2. Main Page Layout Wrapper */}
      <main className="flex-grow mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        
        {/* TAB 1: HOME CATALOG VIEW */}
        {currentTab === 'home' && (
          <div className="space-y-12">
            
            {/* Minimalist Hero Promotion */}
            <Hero 
              onShopAll={handleTriggerShopAll} 
              onSelectCategory={(cat) => {
                setActiveCategory(cat);
                setCurrentPage(1);
              }} 
            />

            {/* Catalog Toolbar Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5" id="catalog-toolbar">
              
              {/* Category buttons matching the screenshot */}
              <div className="flex flex-wrap gap-2" id="category-filters">
                {['All Products', 'Electronics', 'Minimalist Decor', 'Workstation'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setCurrentPage(1); // Reset back to page 1 on filter
                    }}
                    className={`px-4 py-2 text-xs font-semibold tracking-wider transition rounded-full cursor-pointer shadow-sm ${
                      activeCategory === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sorting Filter dropdown */}
              <div className="flex items-center gap-2" id="sorting-dropdown-container">
                <span className="text-xs text-slate-400">Sort by:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-white border border-slate-200 text-xs font-bold text-slate-900 rounded-md focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer py-1.5 px-3 select-none"
                >
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Stock Quantity</option>
                </select>
              </div>

            </div>

            {/* Products grid */}
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-24 text-slate-500 text-xs border border-dashed border-slate-200 rounded-lg bg-white">
                No items found matching the selected parameters.<br />
                Try clearing search or toggling back to "All Products".
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8" id="product-grid">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onEditClick={handleTriggerEdit}
                    onDeleteClick={handleDeleteProduct}
                    onProductClick={handleViewProductDetails}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls bar - matches screenshot precisely */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2.5 pt-8" id="pagination-controls">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="h-8 w-8 flex items-center justify-center border border-slate-200 rounded-md bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 transition cursor-pointer"
                >
                  &lt;
                </button>
                
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`h-8 w-8 text-xs font-semibold transition cursor-pointer rounded-md ${
                      currentPage === idx + 1
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="h-8 w-8 flex items-center justify-center border border-slate-200 rounded-md bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 transition cursor-pointer"
                >
                  &gt;
                </button>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: ADD/EDIT PRODUCT VIEW */}
        {currentTab === 'add-product' && (
          <ProductForm
            editingProduct={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => {
              setCurrentTab('home');
              setEditingProduct(null);
            }}
            isMockMode={isMockMode}
          />
        )}

        {/* TAB 3: ORDERS MANAGEMENT VIEW */}
        {currentTab === 'orders' && (
          <OrdersTab
            orders={orders}
            onToggleStatus={handleToggleOrderStatus}
            isMockMode={isMockMode}
          />
        )}

        {/* TAB 4: DEVELOPER DOCUMENTATION VIEW */}
        {currentTab === 'dev-guide' && (
          <DevDocs />
        )}

      </main>

      {/* 3. Footer branding */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12 text-xs mt-20" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-sans font-bold text-sm text-white block mb-1">Precision Commerce</span>
            <p>© {new Date().getFullYear()} Precision Commerce. All rights reserved.</p>
          </div>
          
          <div className="flex gap-6 font-medium">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Support</a>
          </div>

          <div className="flex gap-4">
            {/* Global web globe and email custom simple icons */}
            <svg className="h-5 w-5 hover:text-white cursor-pointer transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <svg className="h-5 w-5 hover:text-white cursor-pointer transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </footer>

      {/* 4. Live API Console (Collapsible inspector) */}
      <ApiConsole
        logs={apiLogs}
        onClearLogs={() => setApiLogs([])}
        isMockMode={isMockMode}
        onHelloCheck={triggerHelloGreeting}
      />

      {/* 5. Product Detail Modal */}
      {viewingProduct && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
          onClick={() => setViewingProduct(null)}
          id="product-detail-modal"
        >
          <div 
            className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative flex flex-col md:flex-row gap-6 p-6 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
            id={`product-detail-card-${viewingProduct.id}`}
          >
            {/* Close Button */}
            <button
              onClick={() => setViewingProduct(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
              title="Close details"
              id="close-detail-modal-btn"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Product Image Panel */}
            <div className="w-full md:w-1/2 aspect-square bg-slate-50 border border-slate-100 rounded-xl overflow-hidden flex items-center justify-center relative">
              <img
                src={(() => {
                  if (viewingProduct.imageData) {
                    if (viewingProduct.imageData.startsWith('http')) {
                      return viewingProduct.imageData;
                    }
                    if (viewingProduct.imageData.startsWith('data:')) {
                      return viewingProduct.imageData;
                    }
                    return `data:${viewingProduct.imageType || 'image/jpeg'};base64,${viewingProduct.imageData}`;
                  }
                  return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600";
                })()}
                alt={viewingProduct.name}
                className="h-full w-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              
              {/* Badge Overlay */}
              {viewingProduct.isNewBadge && (
                <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-md shadow-sm uppercase">
                  NEW
                </span>
              )}
              {viewingProduct.isLimitedBadge && (
                <span className="absolute top-3 right-12 bg-rose-600 text-white text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-md shadow-sm uppercase">
                  LIMITED
                </span>
              )}
            </div>

            {/* Product Metadata & Info Panel */}
            <div className="w-full md:w-1/2 flex flex-col justify-between pt-4 md:pt-0">
              <div className="space-y-4">
                {/* Category & Availability */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                    {viewingProduct.category || 'GENERIC'}
                  </span>
                  
                  {/* Stock tag */}
                  {!viewingProduct.productAvailable || viewingProduct.stockQuantity === 0 ? (
                    <span className="bg-rose-100 text-rose-700 text-[10px] font-bold tracking-wider px-2 py-1 rounded-md uppercase">
                      OUT OF STOCK
                    </span>
                  ) : (
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold tracking-wider px-2 py-1 rounded-md uppercase">
                      In Stock ({viewingProduct.stockQuantity})
                    </span>
                  )}
                </div>

                {/* Name */}
                <h2 className="text-xl font-bold text-slate-900 tracking-tight" id="detail-product-name">
                  {viewingProduct.name}
                </h2>

                {/* Brand */}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Tag className="h-3.5 w-3.5 text-slate-400" />
                  <span>Brand: <strong className="text-slate-700 font-medium">{viewingProduct.brand || 'Precision Brand'}</strong></span>
                </div>

                {/* Release Date */}
                {viewingProduct.releaseDate && (
                  <div className="flex items-center gap-2 text-xs text-slate-500" id="detail-product-release-date">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>Release Date: <strong className="text-slate-700 font-medium">
                      {(() => {
                        try {
                          return new Date(viewingProduct.releaseDate).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          });
                        } catch (e) {
                          return viewingProduct.releaseDate;
                        }
                      })()}
                    </strong></span>
                  </div>
                )}

                {/* Price tag */}
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-mono font-bold text-slate-900">
                    ${Number(viewingProduct.price).toFixed(2)}
                  </span>
                </div>

                {/* Description Divider */}
                <hr className="border-slate-100" />

                {/* Detailed Description */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Description</h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-h-40 overflow-y-auto pr-1" id="detail-product-description">
                    {viewingProduct.description || "No description provided for this item."}
                  </p>
                </div>
              </div>

              {/* Add to Cart button */}
              <div className="pt-6 mt-auto">
                <button
                  onClick={() => {
                    handleAddToCart(viewingProduct);
                    setViewingProduct(null);
                  }}
                  disabled={!viewingProduct.productAvailable || viewingProduct.stockQuantity === 0}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs tracking-wider transition-all duration-200 active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 disabled:scale-100 shadow-lg shadow-indigo-600/15 cursor-pointer flex items-center justify-center gap-2"
                  id="detail-add-to-cart-btn"
                >
                  <ShoppingCart className="h-4 w-4" />
                  ADD TO CART • ${Number(viewingProduct.price).toFixed(2)}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
