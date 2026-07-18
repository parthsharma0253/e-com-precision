/**
 * This file contains all the TypeScript definitions (interfaces) that match the
 * Spring Boot OpenAPI database schema. Defining types here ensures type safety
 * across our React application and helps you understand the data structure.
 */

export interface Product {
  id?: number;                  // Optional because new products don't have an ID yet
  name: string;                 // Name of the product
  description: string;          // Detailed description
  brand: string;                // Product manufacturer / brand
  price: number;                // Product price (numeric)
  category: string;             // Category (e.g., Electronics, Workstation, Minimalist Decor)
  releaseDate?: string;         // ISO date-time string
  productAvailable: boolean;    // Availability status
  stockQuantity: number;        // Number of items in stock
  imageName?: string;           // File name of the product image
  imageType?: string;           // MIME type (e.g., image/jpeg)
  imageData?: string;           // Optional base64 encoded byte array representing the image
  isNewBadge?: boolean;         // Frontend-only visual flag matching the UI mockup
  isLimitedBadge?: boolean;     // Frontend-only visual flag matching the UI mockup
}

export interface OrderItemRequest {
  productId: number;            // ID of the product being ordered
  quantity: number;             // Quantity requested
}

export interface OrderRequest {
  customerName: string;         // Full name of the customer
  email: string;                // Customer email address
  items: OrderItemRequest[];    // List of ordered items
}

export interface OrderItemResponse {
  productName: string;          // Resolved product name for the order item
  quantity: number;             // Quantity ordered
  totalPrice: number;           // Total price for this line item (quantity * price)
}

export interface OrderResponse {
  orderId: string;              // Unique generated order ID
  customerName: string;         // Customer's name
  email: string;                // Customer's email
  status: string;               // Order status (e.g., "PENDING", "COMPLETED")
  orderDate: string;            // Simple date string (format: YYYY-MM-DD)
  items: OrderItemResponse[];   // Items summary with prices
}

/**
 * Interface to track API logs in our live-learning console.
 * This is extremely useful for seeing exactly what REST endpoints are called.
 */
export interface ApiLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  requestBody?: any;
  responseStatus: number;
  responseBody: any;
  isMock: boolean;
}
