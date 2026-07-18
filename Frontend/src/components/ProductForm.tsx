import React, { useState, useEffect } from 'react';
import { Upload, X, ArrowLeft, Terminal, FileCode2 } from 'lucide-react';
import { Product } from '../types';

interface ProductFormProps {
  editingProduct: Product | null;
  onSave: (product: Product, imageFile: File | null) => Promise<void>;
  onCancel: () => void;
  isMockMode: boolean;
}

export default function ProductForm({
  editingProduct,
  onSave,
  onCancel,
  isMockMode
}: ProductFormProps) {
  // Form input states
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [stockQuantity, setStockQuantity] = useState('10');
  const [productAvailable, setProductAvailable] = useState(true);
  const [releaseDate, setReleaseDate] = useState(new Date().toISOString().substring(0, 10));
  
  // Image handling states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Categories list
  const categories = ['Electronics', 'Workstation', 'Minimalist Decor', 'Accessories', 'Furniture'];

  /**
   * Side-effect: When 'editingProduct' changes, pre-populate the form inputs.
   * This is how React handles updating forms when clicking 'Edit' on a product!
   */
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || '');
      setBrand(editingProduct.brand || '');
      setDescription(editingProduct.description || '');
      setPrice(editingProduct.price ? String(editingProduct.price) : '');
      setCategory(editingProduct.category || 'Electronics');
      setStockQuantity(editingProduct.stockQuantity ? String(editingProduct.stockQuantity) : '10');
      setProductAvailable(editingProduct.productAvailable ?? true);
      setReleaseDate(editingProduct.releaseDate ? editingProduct.releaseDate.substring(0, 10) : '');
      
      if (editingProduct.imageData) {
        if (editingProduct.imageData.startsWith('http')) {
          setImagePreview(editingProduct.imageData);
        } else if (editingProduct.imageData.startsWith('data:')) {
          setImagePreview(editingProduct.imageData);
        } else {
          setImagePreview(`data:${editingProduct.imageType || 'image/jpeg'};base64,${editingProduct.imageData}`);
        }
      } else {
        setImagePreview(null);
      }
      setImageFile(null);
    } else {
      // Clear form for creating new product
      setName('');
      setBrand('');
      setDescription('');
      setPrice('');
      setCategory('Electronics');
      setStockQuantity('10');
      setProductAvailable(true);
      setReleaseDate(new Date().toISOString().substring(0, 10));
      setImagePreview(null);
      setImageFile(null);
    }
  }, [editingProduct]);

  /**
   * Reads a file and creates a base64 preview string
   */
  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file (PNG, JPG, etc.)!");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Handle manual file picking
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  /**
   * Drag & Drop event handlers
   */
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  /**
   * Handle form submit
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !brand) {
      alert("Please fill in Name, Brand, and Price!");
      return;
    }

    setIsSubmitting(true);
    
    // Assemble the product structure matching components.schemas.Product
    const assembledProduct: Product = {
      ...(editingProduct?.id ? { id: editingProduct.id } : {}),
      name,
      brand,
      description,
      price: parseFloat(price) || 0,
      category,
      releaseDate: releaseDate ? `${releaseDate}T00:00:00Z` : undefined,
      productAvailable,
      stockQuantity: parseInt(stockQuantity) || 0,
      // If we have a local preview, store it for offline mock persistence
      imageData: imagePreview || undefined,
      imageName: imageFile?.name || editingProduct?.imageName || 'product.jpg',
      imageType: imageFile?.type || editingProduct?.imageType || 'image/jpeg',
    };

    try {
      await onSave(assembledProduct, imageFile);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fadeIn" id="product-form-container">
      
      {/* Return Navigation bar */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 uppercase tracking-wider cursor-pointer transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Catalog
        </button>
        <h2 className="text-lg font-bold text-slate-900">
          {editingProduct ? '✏️ Edit Product Details' : '📦 Create New Product'}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Form inputs */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6" id="product-input-form">
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">General Information</h3>
            
            {/* Name input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Product Name <span className="text-rose-500">*</span></label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tactile Precision Keyboard"
                className="w-full border border-slate-300 bg-white px-3 py-2 text-xs rounded-md focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800"
              />
            </div>

            {/* Brand and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Brand / Manufacturer <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Precision Brand"
                  className="w-full border border-slate-300 bg-white px-3 py-2 text-xs rounded-md focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Price (USD $) <span className="text-rose-500">*</span></label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 189.00"
                  className="w-full border border-slate-300 bg-white px-3 py-2 text-xs rounded-md focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-mono text-slate-800"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Explain the unique details, ergonomics, specifications, and layout..."
                className="w-full border border-slate-300 bg-white px-3 py-2 text-xs rounded-md focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Inventory & Category</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-slate-300 bg-white px-3 py-2 text-xs rounded-md focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-850"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Stock quantity */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  placeholder="10"
                  className="w-full border border-slate-300 bg-white px-3 py-2 text-xs rounded-md focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-mono text-slate-800"
                />
              </div>
            </div>

            {/* Release Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Release Date</label>
                <input
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  className="w-full border border-slate-300 bg-white px-3 py-2 text-xs rounded-md focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800"
                  id="product-release-date-input"
                />
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="flex items-center space-x-3 pt-2">
              <input
                type="checkbox"
                id="productAvailable"
                checked={productAvailable}
                onChange={(e) => setProductAvailable(e.target.checked)}
                className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="productAvailable" className="text-xs font-semibold text-slate-700 select-none cursor-pointer">
                Product is available for immediate purchase
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-md transition shadow-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-md transition disabled:bg-slate-400 shadow-sm cursor-pointer"
            >
              {isSubmitting ? 'SAVING...' : (editingProduct ? 'UPDATE PRODUCT' : 'CREATE PRODUCT')}
            </button>
          </div>
        </form>

        {/* Right column: Image upload and helpful endpoint diagnostics */}
        <div className="space-y-6">
          
          {/* File Upload Box (Supports drag and drop + click upload) */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Product Image</h3>
            
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition cursor-pointer ${
                dragActive ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-300 hover:border-indigo-400'
              }`}
            >
              {imagePreview ? (
                <div className="relative w-full aspect-square rounded-md overflow-hidden bg-slate-50">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full transition"
                    title="Remove image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="py-6">
                  <Upload className="h-10 w-10 text-slate-300 mx-auto mb-3 stroke-[1.5]" />
                  <p className="text-xs font-semibold text-slate-700 mb-1">
                    Drag and drop file here, or <span className="text-indigo-600 underline font-semibold">browse</span>
                  </p>
                  <p className="text-[10px] text-slate-400">PNG, JPG, or GIF up to 5MB</p>
                </div>
              )}

              {/* Hidden file input element */}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            {imageFile && (
              <p className="text-[11px] text-slate-500 mt-2 truncate text-center bg-slate-50 py-1.5 px-2 rounded-md border border-slate-100 font-mono">
                📄 Selected: {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          {/* Educational Endpoint Reference box */}
          <div className="bg-slate-900 text-slate-300 border border-slate-800 rounded-xl p-6 font-mono text-[11px] leading-relaxed shadow-md">
            <div className="flex items-center gap-2 text-indigo-400 mb-4 font-bold border-b border-slate-850 pb-2">
              <FileCode2 className="h-4 w-4" />
              <span>Spring Boot REST Endpoints</span>
            </div>
            
            <p className="mb-3 text-slate-450">This operation calls the following Spring Boot paths:</p>
            
            {editingProduct ? (
              <div className="space-y-3">
                <div className="p-2.5 bg-slate-950/50 rounded-lg border border-slate-800">
                  <span className="text-indigo-400 font-bold">PUT</span> <span className="text-white">/api/product/{editingProduct.id}</span>
                  <p className="text-[10px] text-slate-500 mt-1">Updates both Product JSON attributes and writes multipart image file binary stream.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-2.5 bg-slate-950/50 rounded-lg border border-slate-800">
                  <span className="text-emerald-400 font-bold">POST</span> <span className="text-white">/api/product</span>
                  <p className="text-[10px] text-slate-500 mt-1">Saves new product instance mapping details and saves binary multipart image bytes.</p>
                </div>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1.5">How images are transferred</span>
              <p className="text-slate-400 text-[10px]">
                Spring Boot accepts product and file together using <code className="text-indigo-300 font-bold">MultipartFormData</code> headers, splitting JSON attributes from raw file binaries.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
