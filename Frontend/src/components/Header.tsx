import React, { useState } from 'react';
import { Search, ShoppingBag, Terminal, CheckCircle2 } from 'lucide-react';

/**
 * TypeScript properties (Props) interface for our Header component.
 * This tells React exactly what data or functions must be passed to this component.
 * Since the user requested step-by-step guidance, this is highly helpful!
 */
interface HeaderProps {
  currentTab: 'home' | 'add-product' | 'orders' | 'dev-guide';
  setCurrentTab: (tab: 'home' | 'add-product' | 'orders' | 'dev-guide') => void;
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
  onSearchSubmit: (keyword: string) => void;
  cartCount: number;
  cartItems: Array<{ product: any; quantity: number }>;
  onCheckout: (customerName: string, email: string) => void;
  onClearCart: () => void;
  isMockMode: boolean;
  setIsMockMode: (mode: boolean) => void;
  apiBaseUrl: string;
  setApiBaseUrl: (url: string) => void;
}

export default function Header({
  currentTab,
  setCurrentTab,
  searchKeyword,
  setSearchKeyword,
  onSearchSubmit,
  cartCount,
  cartItems,
  onCheckout,
  onClearCart,
  isMockMode,
  setIsMockMode,
  apiBaseUrl,
  setApiBaseUrl,
}: HeaderProps) {
  // Local state to manage whether the quick shopping cart drawer/modal is open
  const [isCartOpen, setIsCartOpen] = useState(false);
  // Local state for checking out inside the cart dropdown
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<string | null>(null);

  // Local state to show/hide the server configuration popup
  const [isServerConfigOpen, setIsServerConfigOpen] = useState(false);

  // Calculate cart total price
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  /**
   * Triggers when the user presses Enter in the search box
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit(searchKeyword);
    }
  };

  /**
   * Handles checkout form submission
   */
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custEmail) {
      alert("Please fill in both name and email!");
      return;
    }
    setIsCheckingOut(true);
    try {
      await onCheckout(custName, custEmail);
      setCheckoutStatus("success");
      setCustName('');
      setCustEmail('');
      setTimeout(() => {
        setCheckoutStatus(null);
        setIsCartOpen(false);
      }, 3000);
    } catch (err) {
      setCheckoutStatus("error");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm" id="app-header">
      {/* Dynamic Dev Banner explaining the Active Backend mode (Mock vs Live) */}
      <div className="flex flex-wrap items-center justify-between bg-slate-900 px-4 py-2 text-xs text-white md:px-8">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-mono text-slate-300">
            Backend Connection Mode:
            <strong className={`ml-1 select-none rounded px-1.5 py-0.5 text-[10px] uppercase ${isMockMode ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {isMockMode ? 'Demo Simulator (Offline Active)' : 'Live Spring Boot'}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsServerConfigOpen(!isServerConfigOpen)}
            className="font-mono text-[11px] text-slate-300 hover:text-white underline cursor-pointer"
          >
            Configure Spring URL ({apiBaseUrl})
          </button>
          <div className="h-3 w-[1px] bg-slate-800"></div>
          <button
            onClick={() => setIsMockMode(!isMockMode)}
            className="rounded bg-white/10 px-2.5 py-0.5 font-mono text-[10px] text-white transition hover:bg-white/20"
          >
            Switch to {isMockMode ? 'Live Spring Server' : 'Mock Simulator'}
          </button>
        </div>
      </div>

      {/* Spring Boot Server URL Config Panel (Collapsible) */}
      {isServerConfigOpen && (
        <div className="border-b border-indigo-100 bg-indigo-50/50 p-4 font-sans text-xs text-slate-700 animate-fadeIn">
          <div className="mx-auto max-w-4xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-900">🔗 Spring Boot Server Connection</p>
              <p className="text-slate-500">By default, Spring Boot runs on <code className="bg-slate-100 text-slate-700 px-1 rounded">http://localhost:8081</code>. Ensure CORS is enabled on your product-controller!</p>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="text"
                value={apiBaseUrl}
                onChange={(e) => setApiBaseUrl(e.target.value)}
                placeholder="http://localhost:8081"
                className="w-full md:w-64 border border-slate-200 bg-white px-3 py-1.5 rounded-md text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-800"
              />
              <button
                onClick={() => {
                  setIsServerConfigOpen(false);
                  alert(`API Base URL saved: ${apiBaseUrl}`);
                }}
                className="bg-indigo-600 text-white px-4 py-1.5 rounded-md font-semibold hover:bg-indigo-700 cursor-pointer shadow-sm transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary Navigation Bar (Identical to the uploaded mockup layout) */}
      <div className="mx-auto flex max-w-7xl h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo - Styled as "Precision Commerce" */}
        <div className="flex items-center cursor-pointer" onClick={() => setCurrentTab('home')} id="logo-container">
          <span className="font-sans text-xl font-bold tracking-tight text-slate-900">
            Precision Commerce
          </span>
        </div>

        {/* Center Links: Home, Add Product, Orders, Docs */}
        <nav className="hidden md:flex h-full items-center space-x-8" id="main-nav">
          <button
            onClick={() => setCurrentTab('home')}
            className={`relative h-full px-1 flex items-center text-sm font-semibold transition cursor-pointer ${
              currentTab === 'home'
                ? 'text-indigo-600 border-b-2 border-indigo-600 pt-[2px]'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentTab('add-product')}
            className={`relative h-full px-1 flex items-center text-sm font-semibold transition cursor-pointer ${
              currentTab === 'add-product'
                ? 'text-indigo-600 border-b-2 border-indigo-600 pt-[2px]'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Add Product
          </button>
          <button
            onClick={() => setCurrentTab('orders')}
            className={`relative h-full px-1 flex items-center text-sm font-semibold transition cursor-pointer ${
              currentTab === 'orders'
                ? 'text-indigo-600 border-b-2 border-indigo-600 pt-[2px]'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setCurrentTab('dev-guide')}
            className={`relative h-full px-1 flex items-center text-sm font-semibold transition cursor-pointer ${
              currentTab === 'dev-guide'
                ? 'text-indigo-600 border-b-2 border-indigo-600 pt-[2px]'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Developer Guide 📖
          </button>
        </nav>

        {/* Right Section: Search & Cart Button */}
        <div className="flex items-center space-x-6" id="search-cart-section">
          
          {/* Custom Search Box: matches the exact screenshot format: text input + "SEARCH" label inside button */}
          <div className="hidden sm:flex items-center border border-slate-300 rounded-md overflow-hidden bg-white max-w-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition">
            <div className="flex items-center pl-3 text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search products..."
              className="px-3 py-2 text-xs focus:outline-none w-48 text-slate-800"
            />
            <button
              onClick={() => onSearchSubmit(searchKeyword)}
              className="bg-indigo-600 text-white border-l border-indigo-700 px-4 py-2 text-[11px] font-bold tracking-wider hover:bg-indigo-700 active:bg-indigo-800 transition duration-150 cursor-pointer"
            >
              SEARCH
            </button>
          </div>

          {/* Quick links on mobile for tabs */}
          <div className="flex md:hidden items-center space-x-2 text-xs">
            <button 
              onClick={() => setCurrentTab('home')} 
              className={`p-1.5 rounded-md ${currentTab === 'home' ? 'bg-indigo-50 font-bold text-indigo-600' : 'text-slate-500'}`}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentTab('add-product')} 
              className={`p-1.5 rounded-md ${currentTab === 'add-product' ? 'bg-indigo-50 font-bold text-indigo-600' : 'text-slate-500'}`}
            >
              Add
            </button>
            <button 
              onClick={() => setCurrentTab('orders')} 
              className={`p-1.5 rounded-md ${currentTab === 'orders' ? 'bg-indigo-50 font-bold text-indigo-600' : 'text-slate-500'}`}
            >
              Orders
            </button>
          </div>

          {/* Shopping Cart Trigger icon */}
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative p-2.5 text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-full transition cursor-pointer"
            id="cart-trigger-btn"
            aria-label="View shopping cart"
          >
            <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white leading-none">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Shopping Cart Dropdown Modal (Drawer replacement matching iframe accessibility) */}
      {isCartOpen && (
        <div className="absolute right-4 mt-2 w-96 border border-slate-200 bg-white shadow-xl rounded-lg overflow-hidden z-50 animate-fadeIn" id="cart-dropdown">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-sans text-sm font-bold text-slate-900">Your Cart</h3>
            <button
              onClick={onClearCart}
              className="text-[11px] font-semibold text-slate-500 hover:text-red-600 underline cursor-pointer"
            >
              Clear All
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              <ShoppingBag className="h-10 w-10 mx-auto text-slate-300 mb-3 stroke-[1]" />
              Your cart is currently empty.<br />Add products from the catalog to test checkout!
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
              {cartItems.map((item, idx) => (
                <div key={idx} className="p-4 flex gap-3 text-xs">
                  <img
                    src={item.product.imageData || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=150"}
                    alt={item.product.name}
                    className="h-12 w-12 rounded-md object-cover border border-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{item.product.name}</p>
                    <p className="text-slate-500 text-[10px] uppercase tracking-wide">{item.product.brand}</p>
                    <p className="text-slate-500 mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right font-mono font-medium text-slate-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}

              {/* Cart Summary & Order Placement Form */}
              <div className="p-4 bg-slate-50">
                <div className="flex justify-between font-medium text-xs mb-4">
                  <span>Total Due:</span>
                  <span className="font-mono font-bold text-sm text-slate-900">${cartTotal.toFixed(2)}</span>
                </div>

                {checkoutStatus === "success" ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md p-3 text-center flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Order placed successfully!</span>
                  </div>
                ) : (
                  <form onSubmit={handleCheckoutSubmit} className="space-y-3">
                    <div className="h-[1px] bg-slate-200 my-2"></div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Customer Details (Mock POST Order)</p>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full border border-slate-200 bg-white px-2.5 py-1.5 rounded-md text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-850"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={custEmail}
                        onChange={(e) => setCustEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full border border-slate-200 bg-white px-2.5 py-1.5 rounded-md text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-850"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isCheckingOut}
                      className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold py-2 px-4 rounded-md tracking-wider transition disabled:bg-slate-400 cursor-pointer shadow-sm"
                    >
                      {isCheckingOut ? 'PROCESSING...' : 'PLACE ORDER'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
