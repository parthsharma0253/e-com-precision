import React from 'react';
import { ShoppingBag, Calendar, Mail, User, ShieldCheck, HelpCircle } from 'lucide-react';
import { OrderResponse } from '../types';

interface OrdersTabProps {
  orders: OrderResponse[];
  onToggleStatus?: (orderId: string) => void;
  isMockMode: boolean;
}

export default function OrdersTab({
  orders,
  onToggleStatus,
  isMockMode
}: OrdersTabProps) {

  /**
   * Helper function to calculate the grand total price of an order
   */
  const calculateOrderTotal = (order: OrderResponse) => {
    return order.items.reduce((total, item) => total + (item.totalPrice || 0), 0);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-fadeIn" id="orders-tab-container">
      
      {/* Title section */}
      <div className="border-b border-slate-200 pb-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-950">📋 Orders Management Dashboard</h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse and monitor orders received via the <code className="bg-slate-100 text-slate-800 px-1 rounded text-[11px]">POST /api/orders/place</code> API.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-md text-xs font-mono text-indigo-700 border border-indigo-100">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Endpoint: <strong className="text-indigo-900 font-bold">GET /api/orders</strong></span>
        </div>
      </div>

      {orders.length === 0 ? (
        /* Empty State */
        <div className="bg-white border border-slate-200 rounded-xl p-16 text-center max-w-lg mx-auto shadow-sm">
          <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-4 stroke-[1.2]" />
          <h3 className="font-bold text-slate-950 text-sm mb-1">No Orders Logged</h3>
          <p className="text-slate-500 text-xs mb-6">
            There are no orders placed yet. Go to the Home catalog, add some products to your shopping cart, and complete a test checkout to see them here!
          </p>
        </div>
      ) : (
        /* Orders list */
        <div className="space-y-6" id="orders-list">
          {orders.map((order) => {
            const grandTotal = calculateOrderTotal(order);
            const isPending = order.status?.toUpperCase() === 'PENDING';

            return (
              <div 
                key={order.orderId}
                className="bg-white border border-slate-200 hover:border-indigo-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-200"
                id={`order-card-${order.orderId}`}
              >
                {/* Order Top Bar Details */}
                <div className="bg-slate-50 border-b border-slate-100 p-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      ID: {order.orderId}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                      isPending 
                        ? 'bg-amber-100 text-amber-800 border border-amber-200 shadow-sm' 
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 font-mono text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{order.orderDate}</span>
                    </div>
                    <div>
                      <span>Total: </span>
                      <strong className="text-slate-900 font-bold">${grandTotal.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>

                {/* Customer Details & Items grid */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Customer Box */}
                  <div className="space-y-2 text-xs text-slate-600 border-r border-slate-100 pr-4">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                      <User className="h-3 w-3" /> Customer Details
                    </p>
                    <p className="font-semibold text-slate-900">{order.customerName}</p>
                    <p className="flex items-center gap-1.5 truncate">
                      <Mail className="h-3.5 w-3.5 text-slate-400" /> {order.email}
                    </p>
                  </div>

                  {/* Items List Box */}
                  <div className="md:col-span-2 space-y-3">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
                      Order Items ({order.items.length})
                    </p>
                    
                    <div className="divide-y divide-slate-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-2 flex items-center justify-between text-xs">
                          <div className="flex-1 min-w-0 pr-4">
                            <p className="font-medium text-slate-900 truncate">{item.productName}</p>
                            <p className="text-slate-400 text-[10px]">Quantity: {item.quantity}</p>
                          </div>
                          <div className="font-mono text-slate-900">
                            ${(item.totalPrice || 0).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Actions panel */}
                    {onToggleStatus && (
                      <div className="pt-3 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={() => onToggleStatus(order.orderId)}
                          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 hover:border-indigo-150 px-3 py-1.5 rounded-md cursor-pointer transition shadow-sm"
                          title="Click to toggle status (PENDING / COMPLETED)"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Mark as {isPending ? 'Completed' : 'Pending'}
                        </button>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Backend Integration Tutorial Box */}
      <div className="mt-12 bg-slate-900 text-slate-300 border border-slate-800 rounded-xl p-6 shadow-md">
        <h4 className="font-sans text-sm font-bold text-white mb-2 flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-amber-400" />
          Spring Boot Controller Relationship
        </h4>
        <div className="text-xs space-y-2 leading-relaxed text-slate-450 font-sans">
          <p>
            When a customer checks out, the React frontend aggregates all item IDs & quantities inside the shopping cart. It sends an HTTP <code className="bg-slate-850 text-slate-200 px-1 rounded font-mono">POST</code> request containing the <code className="bg-slate-850 text-slate-200 px-1 rounded font-mono">OrderRequest</code> schema to:
          </p>
          <pre className="bg-slate-950 p-2.5 rounded-lg text-[11px] font-mono text-amber-300 overflow-x-auto border border-slate-850 shadow-inner">
            POST {isMockMode ? '(Mocking)' : 'http://localhost:8081'}/api/orders/place
          </pre>
          <p>
            The Spring Boot application resolves product prices, checks inventory levels, generates a secure Order ID, saves the entity inside your relational database, and returns a fully populated <code className="bg-slate-850 text-slate-200 px-1 rounded font-mono">OrderResponse</code>.
          </p>
        </div>
      </div>

    </div>
  );
}
