import React, { useState, useEffect } from "react";
import { CanteenOrder } from "../types";
import { Bell, Clock, CheckCircle2, ChefHat, Sparkles, ChevronRight, X } from "lucide-react";

interface LiveTokenCallingBannerProps {
  orders: CanteenOrder[];
  onOpenTray: () => void;
  onOpenOrderReceipt: (order: CanteenOrder) => void;
}

export const LiveTokenCallingBanner: React.FC<LiveTokenCallingBannerProps> = ({
  orders,
  onOpenOrderReceipt,
}) => {
  const [boardData, setBoardData] = useState<{
    window1: { ready: number[]; preparing: number[] };
    window2: { ready: number[]; preparing: number[] };
  }>({
    window1: { ready: [236], preparing: [239] },
    window2: { ready: [238], preparing: [240] },
  });

  const [showOrderDrawer, setShowOrderDrawer] = useState<boolean>(false);

  // Poll live canteen token board every 10 seconds
  useEffect(() => {
    const fetchBoard = () => {
      fetch("/api/canteen/board")
        .then((res) => res.json())
        .then((data) => {
          if (data.window1 && data.window2) {
            setBoardData({
              window1: data.window1,
              window2: data.window2,
            });
          }
        })
        .catch((e) => console.warn("Could not poll board:", e));
    };

    fetchBoard();
    const interval = setInterval(fetchBoard, 8000);
    return () => clearInterval(interval);
  }, []);

  const activeStudentOrders = orders.filter(
    (o) => o.status === "Preparing" || o.status === "Ready" || o.status === "Queued"
  );

  return (
    <>
      <div
        id="canteen-live-token-ticker"
        className="w-full bg-[#212e27] text-[#F2EFE4] border-b border-[#F2EFE4]/15 px-4 py-2 font-body text-xs"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Canteen counter calling marquee / displays */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 font-receipt text-[11px]">
            <div className="flex items-center gap-1.5 text-[#E3A008]">
              <ChefHat className="w-4 h-4 shrink-0" />
              <span className="font-bold uppercase tracking-wider">Kitchen Live Calling:</span>
            </div>

            {/* Window 1 */}
            <div className="flex items-center gap-1.5 bg-[#26362E] px-2.5 py-1 border border-[#F2EFE4]/20">
              <span className="text-[#F2EFE4]/70">Window 1 (Main):</span>
              {boardData.window1.ready.length > 0 ? (
                <div className="flex items-center gap-1 font-bold text-[#E3A008]">
                  <span className="animate-pulse">●</span>
                  <span>Tokens {boardData.window1.ready.map((t) => `#${t}`).join(", ")}</span>
                </div>
              ) : (
                <span className="text-[#F2EFE4]/50">Cooking next batch</span>
              )}
            </div>

            {/* Window 2 */}
            <div className="flex items-center gap-1.5 bg-[#26362E] px-2.5 py-1 border border-[#F2EFE4]/20">
              <span className="text-[#F2EFE4]/70">Window 2 (Express):</span>
              {boardData.window2.ready.length > 0 ? (
                <div className="flex items-center gap-1 font-bold text-[#68D391]">
                  <span className="animate-pulse">●</span>
                  <span>Tokens {boardData.window2.ready.map((t) => `#${t}`).join(", ")}</span>
                </div>
              ) : (
                <span className="text-[#F2EFE4]/50">Window Clear</span>
              )}
            </div>
          </div>

          {/* Student's active orders indicator */}
          <div className="flex items-center gap-2">
            {activeStudentOrders.length > 0 ? (
              <button
                id="view-active-orders-btn"
                onClick={() => setShowOrderDrawer(true)}
                className="px-3 py-1 bg-[#E3A008] text-[#2A2420] hover:bg-[#d49407] font-semibold text-[11px] font-receipt flex items-center gap-1.5 transition cursor-pointer border border-[#2A2420]/30 shadow-xs"
              >
                <Bell className="w-3.5 h-3.5 animate-bounce" />
                <span>
                  Your Orders ({activeStudentOrders.length}):{" "}
                  {activeStudentOrders[0].status === "Ready"
                    ? `Token #${activeStudentOrders[0].tokenNumber} Ready!`
                    : `Token #${activeStudentOrders[0].tokenNumber} In Prep`}
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : orders.length > 0 ? (
              <button
                onClick={() => setShowOrderDrawer(true)}
                className="text-[11px] font-receipt text-[#F2EFE4]/80 hover:text-[#F2EFE4] underline cursor-pointer"
              >
                Past Tokens ({orders.length})
              </button>
            ) : (
              <div className="text-[11px] font-receipt text-[#F2EFE4]/60 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#E3A008]" />
                <span>Average Kitchen Turnaround: 6-10 mins</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Orders Drawer / Modal */}
      {showOrderDrawer && (
        <div
          className="fixed inset-0 z-50 bg-[#1b2520]/80 backdrop-blur-xs flex items-center justify-center p-4 font-body"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowOrderDrawer(false);
          }}
        >
          <div className="bg-[#FBF6EC] border-2 border-[#2A2420] text-[#2A2420] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 bg-[#26362E] text-[#F2EFE4] flex items-center justify-between border-b border-[#F2EFE4]/20">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-[#E3A008]" />
                <h3 className="font-chalk text-2xl">Campus Canteen Orders</h3>
              </div>
              <button
                onClick={() => setShowOrderDrawer(false)}
                className="p-1 text-[#F2EFE4]/80 hover:text-[#F2EFE4] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {orders.length === 0 ? (
                <div className="text-center py-8 text-[#2A2420]/60 font-receipt">
                  No orders placed yet. Add dishes to your tray to generate an order token!
                </div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3 bg-[#F6EFE2] border border-[#2A2420]/25 font-receipt text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-chalk text-xl text-[#2A2420]">
                          Token #{ord.tokenNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold ${
                            ord.status === "Ready"
                              ? "bg-[#68D391] text-[#1A202C]"
                              : ord.status === "Preparing"
                              ? "bg-[#E3A008] text-[#2A2420]"
                              : "bg-[#2A2420]/20 text-[#2A2420]"
                          }`}
                        >
                          {ord.status.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[#2A2420]/60 text-[11px]">{ord.createdAt}</span>
                    </div>

                    <div className="text-[11px] text-[#2A2420]/80">
                      <span className="font-semibold">Pickup:</span> {ord.pickupWindow}
                    </div>

                    <div className="text-[11px] border-t border-dashed border-[#2A2420]/20 pt-1 text-[#2A2420]/90">
                      {ord.items.map((i, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>
                            {i.quantity}x {i.item.name}
                          </span>
                          <span>₹{(i.item.price * i.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#2A2420]/20 font-bold">
                      <span>Total Paid ({ord.paymentMethod}):</span>
                      <span>₹{ord.totalCost.toFixed(2)}</span>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => {
                          onOpenOrderReceipt(ord);
                          setShowOrderDrawer(false);
                        }}
                        className="flex-1 py-1.5 border border-[#2A2420]/30 hover:bg-[#2A2420]/5 text-[11px] font-medium text-center cursor-pointer"
                      >
                        View Official Token Slip
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-[#F6EFE2] border-t border-[#2A2420]/20 text-center">
              <button
                onClick={() => setShowOrderDrawer(false)}
                className="px-4 py-1.5 bg-[#2A2420] text-[#FBF6EC] text-xs cursor-pointer"
              >
                Close Orders
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
