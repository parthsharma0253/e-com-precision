import { Product, OrderResponse } from '../types';

/**
 * These are high-quality placeholder images from Unsplash that match the
 * exact aesthetic of the minimalist "Precision Commerce" mockup in the user's image.
 */
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Tactile Precision Keyboard",
    description: "Low-profile mechanical switches designed for high-speed typing accuracy and maximum acoustic comfort in quiet professional environments.",
    brand: "Precision Brand",
    price: 189.00,
    category: "Electronics",
    releaseDate: "2026-01-15T10:00:00Z",
    productAvailable: true,
    stockQuantity: 42,
    imageName: "keyboard.jpg",
    imageType: "image/jpeg",
    // This is a curated beautiful image representing the minimalist mechanical keyboard in the mockup
    imageData: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600&auto=format&fit=crop",
    isNewBadge: true
  },
  {
    id: 2,
    name: "Architectural LED Task Lamp",
    description: "Fully articulating steel arm lamp with dimmable natural-spectrum LEDs and color-temperature presets to reduce eye strain.",
    brand: "Lumina Concepts",
    price: 125.00,
    category: "Workstation",
    releaseDate: "2025-11-20T08:30:00Z",
    productAvailable: true,
    stockQuantity: 18,
    imageName: "lamp.jpg",
    imageType: "image/jpeg",
    // Clean modern silver articulated architect desk lamp
    imageData: "https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Acoustic Pure Headphones",
    description: "Studio-reference over-ear headphones featuring hybrid active noise cancellation, custom 40mm beryllium drivers, and breathable lambskin pads.",
    brand: "AudioTech Elite",
    price: 349.50,
    category: "Electronics",
    releaseDate: "2026-02-01T14:00:00Z",
    productAvailable: true,
    stockQuantity: 8,
    imageName: "headphones.jpg",
    imageType: "image/jpeg",
    // Sleek space-grey overhead headphones
    imageData: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600&auto=format&fit=crop",
    isLimitedBadge: true
  },
  {
    id: 4,
    name: "Organic Sculptural Vase",
    description: "Individually hand-thrown ceramic donut vase with a textured matte chalk finish, designed to display dry branches or single stems.",
    brand: "Studio Element",
    price: 68.00,
    category: "Minimalist Decor",
    releaseDate: "2025-08-12T12:00:00Z",
    productAvailable: true,
    stockQuantity: 25,
    imageName: "vase.jpg",
    imageType: "image/jpeg",
    // Textured hollow circle geometric white ceramic vase
    imageData: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Graphite Leather Desk Mat",
    description: "Waterproof, top-grain pebble leather mat with a non-slip suede base and heavy-duty perimeter stitching for fluid mouse tracking.",
    brand: "Precision Brand",
    price: 95.00,
    category: "Workstation",
    releaseDate: "2025-05-30T09:00:00Z",
    productAvailable: true,
    stockQuantity: 50,
    imageName: "deskmat.jpg",
    imageType: "image/jpeg",
    // Luxury workspace desk pad
    imageData: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Chrono Minimalist E-Ink Clock",
    description: "An elegant e-ink screen desk clock encased in premium white oak, displaying time in high-contrast crisp text with indoor humidity sensor.",
    brand: "Modern Living",
    price: 72.00,
    category: "Electronics",
    releaseDate: "2026-03-10T16:45:00Z",
    productAvailable: true,
    stockQuantity: 12,
    imageName: "clock.jpg",
    imageType: "image/jpeg",
    // Minimalist digital clock
    imageData: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop"
  }
];

export const INITIAL_ORDERS: OrderResponse[] = [
  {
    orderId: "ORD-98721",
    customerName: "Alex Mercer",
    email: "alex@example.com",
    status: "COMPLETED",
    orderDate: "2026-06-25",
    items: [
      {
        productName: "Tactile Precision Keyboard",
        quantity: 1,
        totalPrice: 189.00
      },
      {
        productName: "Graphite Leather Desk Mat",
        quantity: 1,
        totalPrice: 95.00
      }
    ]
  },
  {
    orderId: "ORD-98722",
    customerName: "Sophia Patel",
    email: "sophia@example.com",
    status: "PENDING",
    orderDate: "2026-06-27",
    items: [
      {
        productName: "Architectural LED Task Lamp",
        quantity: 1,
        totalPrice: 125.00
      }
    ]
  }
];
