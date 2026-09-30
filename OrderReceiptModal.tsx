import React from "react";
import { CanteenOrder } from "../types";
import { X, Printer, Clock, CheckCircle, ChefHat, AlertTriangle } from "lucide-react";

interface OrderReceiptModalProps {
  order: CanteenOrder | null;
  onClose: () => void;
  onCancelOrder?: (orderId: string) => void;
}

export const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({
  order,
  onClose,
  onCancelOrder,
}) => {
  if (!order) return null;

  return (
    <div
      id="order-receipt-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#1b2520]/80 backdrop-blur-xs flex items-center justify-center p-4 font-body"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="order-receipt-modal-card"
        className="bg-[#FBF6EC] border-2 border-[#2A2420] text-[#2A2420] w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 bg-[#26362E] text-[#F2EFE4] flex items-center justify-between border-b-2 border-[#2A2420]">
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-[#E3A008]" />
            <div>
              <h3 className="font-chalk text-2xl leading-none">Order Token Slip</h3>
              <p className="text-[10px] font-receipt text-[#F2EFE4]/70 mt-0.5">
                Token #{order.tokenNumber} • {order.status.toUpperCase()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#F2EFE4]/80 hover:text-[#F2EFE4] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs font-body">
          {/* Main Token Stamp Box */}
          <div className="text-center p-4 bg-[#F6EFE2] border border-dashed border-[#2A2420]/30 space-y-1">
            <span className="font-receipt text-[10px] tracking-widest text-[#2A2420]/70 uppercase">
              CAMPUS CANTEEN TOKEN
            </span>
            <div className="font-chalk text-5xl text-[#2A2420]">#{order.tokenNumber}</div>
            <div className="font-receipt text-xs text-[#2A2420]/80 font-bold">
              {order.pickupWindow}
            </div>
            <div className="text-[10px] font-receipt text-[#2A2420]/60">
              Ordered at {order.createdAt}
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-between p-3 bg-white border border-[#2A2420]/20 font-receipt">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#E3A008]" />
              <div>
                <span className="font-bold block text-[#2A2420]">Current Status:</span>
                <span className="text-[11px] text-[#2A2420]/70">
                  {order.status === "Ready"
                    ? "Food is plated and ready for pickup!"
                    : order.status === "Preparing"
                    ? "Cooking now in kitchen"
                    : order.status}
                </span>
              </div>
            </div>
            <span
              className={`px-2 py-0.5 font-bold text-[10px] ${
                order.status === "Ready"
                  ? "bg-[#68D391] text-[#1A202C]"
                  : "bg-[#E3A008] text-[#2A2420]"
              }`}
            >
              {order.status}
            </span>
          </div>

          {/* Items breakdown */}
          <div className="p-3.5 bg-white border border-[#2A2420]/20 font-receipt space-y-2">
            <div className="flex justify-between text-[11px] text-[#2A2420]/60 border-b border-[#2A2420]/15 pb-1 uppercase">
              <span>Item Description</span>
              <span>Amount</span>
            </div>
            {order.items.map((i, idx) => (
              <div key={idx} className="flex justify-between text-[#2A2420]">
                <span>
                  {i.quantity}x {i.item.name}
                </span>
                <span>₹{(i.item.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
            {order.specialNotes && (
              <div className="text-[11px] text-[#C1442D] italic pt-1 border-t border-dashed border-[#2A2420]/15">
                Kitchen Note: "{order.specialNotes}"
              </div>
            )}
            <div className="pt-2 border-t border-[#2A2420]/20 flex justify-between font-bold text-sm">
              <span>Total Settled:</span>
              <span>₹{order.totalCost.toFixed(2)}</span>
            </div>
            <div className="text-[10px] text-[#2A2420]/60 pt-0.5">
              Payment Mode: {order.paymentMethod} • Roll: {order.studentId || "Counter"}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#F6EFE2] border-t-2 border-[#2A2420] flex items-center justify-between gap-2">
          {order.status === "Preparing" && onCancelOrder && (
            <button
              onClick={() => {
                onCancelOrder(order.id);
                onClose();
              }}
              className="text-xs text-[#C1442D] hover:underline cursor-pointer"
            >
              Cancel Order
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 border border-[#2A2420]/30 hover:bg-[#2A2420]/5 text-xs font-medium flex items-center gap-1.5 cursor-pointer font-receipt"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Slip
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#2A2420] text-[#FBF6EC] text-xs font-semibold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
