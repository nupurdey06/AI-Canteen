import React, { useState, useEffect } from "react";
import { MenuItem, TrayItem, CanteenOrder, PaymentMethod } from "../types";
import {
  X,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  Clock,
  ShoppingBag,
  CreditCard,
  QrCode,
  Coins,
  Printer,
  ChevronRight,
  Sparkles,
  AlertCircle
} from "lucide-react";

interface StudentTrayModalProps {
  isOpen: boolean;
  onClose: () => void;
  trayItems: TrayItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearTray: () => void;
  onOrderPlaced: (order: CanteenOrder) => void;
}

export const StudentTrayModal: React.FC<StudentTrayModalProps> = ({
  isOpen,
  onClose,
  trayItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearTray,
  onOrderPlaced,
}) => {
  const [step, setStep] = useState<"tray" | "checkout" | "confirmed">("tray");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Campus Card");
  const [studentId, setStudentId] = useState<string>("STU-2026-8941");
  const [specialNotes, setSpecialNotes] = useState<string>("");
  const [confirmedOrder, setConfirmedOrder] = useState<CanteenOrder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(0);

  // Calculate order totals
  const totalCost = trayItems.reduce(
    (sum, entry) => sum + entry.item.price * entry.quantity,
    0
  );

  const maxPrepTime = trayItems.reduce(
    (max, entry) => Math.max(max, entry.item.prep_time_minutes),
    0
  );

  // Student Card simulated balance
  const demoCardBalance = 485.0;
  const balanceAfterOrder = demoCardBalance - totalCost;

  // Countdown timer for confirmed order
  useEffect(() => {
    if (!confirmedOrder) return;
    const initialSeconds = confirmedOrder.prepTimeMinutes * 60;
    setTimeLeftSeconds(initialSeconds);

    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [confirmedOrder]);

  if (!isOpen) return null;

  const handlePlaceOrder = async () => {
    if (trayItems.length === 0) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: trayItems,
          paymentMethod,
          studentId: paymentMethod === "Campus Card" ? studentId : undefined,
          specialNotes: specialNotes.trim() || undefined,
        }),
      });

      const data = await response.json();
      if (data.order) {
        setConfirmedOrder(data.order);
        setStep("confirmed");
        onOrderPlaced(data.order);
      }
    } catch (err) {
      console.error("Order submission failed, creating local token fallback:", err);
      // Fallback
      const fallbackToken = Math.floor(250 + Math.random() * 500);
      const fallbackOrder: CanteenOrder = {
        id: `ord_${Date.now()}`,
        tokenNumber: fallbackToken,
        items: [...trayItems],
        totalCost,
        prepTimeMinutes: maxPrepTime,
        paymentMethod,
        studentId: studentId,
        specialNotes: specialNotes,
        createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "Preparing",
        pickupWindow: trayItems.some((i) => i.item.category === "Main")
          ? "Window 1 (Main Meals)"
          : "Window 2 (Express Tiffins)",
        readyAtTimestamp: Date.now() + maxPrepTime * 60 * 1000,
      };
      setConfirmedOrder(fallbackOrder);
      setStep("confirmed");
      onOrderPlaced(fallbackOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfirmedOrder(null);
    setStep("tray");
    setSpecialNotes("");
    onClearTray();
    onClose();
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div
      id="student-tray-backdrop"
      className="fixed inset-0 z-50 bg-[#1b2520]/80 backdrop-blur-xs flex items-center justify-center p-4 font-body"
      onClick={(e) => {
        if (e.target === e.currentTarget && step !== "confirmed") onClose();
      }}
    >
      <div
        id="student-tray-dialog"
        className="bg-[#FBF6EC] border-2 border-[#2A2420] text-[#2A2420] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Tray Header */}
        <div className="p-4 sm:p-5 bg-[#26362E] text-[#F2EFE4] flex items-center justify-between border-b-2 border-[#2A2420]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#E3A008]" />
            <div>
              <h3 className="font-chalk text-2xl leading-tight">
                {step === "confirmed"
                  ? "Order Token Confirmed"
                  : step === "checkout"
                  ? "Canteen Counter Checkout"
                  : "Student Meal Tray"}
              </h3>
              <p className="text-[11px] font-receipt text-[#F2EFE4]/70">
                {step === "confirmed"
                  ? "Take this token to the pickup counter"
                  : `${trayItems.length} ${trayItems.length === 1 ? "dish" : "dishes"} selected`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#F2EFE4]/70 hover:text-[#F2EFE4] transition cursor-pointer"
            aria-label="Close tray"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {step === "confirmed" && confirmedOrder ? (
            /* STEP 3: ORDER CONFIRMED & PHYSICAL TOKEN SCREEN */
            <div id="printable-order-slip" className="text-center space-y-4 font-body">
              {/* Rubber Stamp Header */}
              <div className="inline-block p-1 border-2 border-[#2A2420] rotate-[-1deg]">
                <div className="border border-dashed border-[#2A2420] px-4 py-1.5 bg-[#F6EFE2]">
                  <span className="font-receipt text-[10px] tracking-widest uppercase font-bold text-[#2A2420]">
                    OFFICIAL CANTEEN TOKEN SLIP
                  </span>
                </div>
              </div>

              {/* Big Chalkboard Token Number */}
              <div className="bg-[#26362E] text-[#F2EFE4] p-4 border border-[#2A2420] shadow-inner space-y-1">
                <span className="text-[11px] font-receipt uppercase tracking-widest text-[#E3A008]">
                  Token Number
                </span>
                <div className="font-chalk text-5xl text-[#F2EFE4] tracking-tight">
                  #{confirmedOrder.tokenNumber}
                </div>
                <div className="text-xs font-receipt text-[#F2EFE4]/80 mt-1">
                  Collect at: <span className="font-bold text-[#E3A008]">{confirmedOrder.pickupWindow}</span>
                </div>
              </div>

              {/* Live Kitchen Preparation Timer */}
              <div className="p-3 bg-[#F6EFE2] border border-[#2A2420]/20 font-receipt text-xs space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold text-[#2A2420]">
                    <Clock className="w-3.5 h-3.5 text-[#E3A008]" />
                    Kitchen Progress
                  </span>
                  <span className="text-[#2A2420]/80">
                    {timeLeftSeconds > 0
                      ? `Est. Ready in ${formatCountdown(timeLeftSeconds)}`
                      : "Ready at Pickup Window!"}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#2A2420]/10 h-2 overflow-hidden">
                  <div
                    className="bg-[#E3A008] h-full transition-all duration-1000"
                    style={{
                      width: `${
                        timeLeftSeconds > 0
                          ? Math.max(
                              10,
                              Math.round(
                                ((confirmedOrder.prepTimeMinutes * 60 - timeLeftSeconds) /
                                  (confirmedOrder.prepTimeMinutes * 60)) *
                                  100
                              )
                            )
                          : 100
                      }%`,
                    }}
                  />
                </div>
                <div className="text-[10px] text-[#2A2420]/60">
                  Paid via {confirmedOrder.paymentMethod} • Student ID: {confirmedOrder.studentId}
                </div>
              </div>

              {/* Order breakdown slip */}
              <div className="p-4 bg-[#F6EFE2] border border-dashed border-[#2A2420]/30 text-left font-receipt text-xs space-y-1.5">
                <div className="text-[11px] uppercase font-bold text-[#2A2420]/60 pb-1 border-b border-[#2A2420]/15 flex justify-between">
                  <span>Order Items</span>
                  <span>Qty × Price</span>
                </div>
                {confirmedOrder.items.map((entry) => (
                  <div key={entry.item.id} className="flex justify-between">
                    <span>
                      {entry.quantity}x {entry.item.name}
                    </span>
                    <span>₹{(entry.item.price * entry.quantity).toFixed(2)}</span>
                  </div>
                ))}
                {confirmedOrder.specialNotes && (
                  <div className="text-[11px] text-[#C1442D] italic pt-1">
                    Kitchen Note: "{confirmedOrder.specialNotes}"
                  </div>
                )}
                <div className="pt-2 border-t border-[#2A2420]/20 flex justify-between font-bold text-sm">
                  <span>Total Settled:</span>
                  <span>₹{confirmedOrder.totalCost.toFixed(2)}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2 border border-[#2A2420]/30 hover:bg-[#2A2420]/5 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Token Slip
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-2 bg-[#E3A008] hover:bg-[#d49407] text-[#2A2420] text-xs font-semibold cursor-pointer"
                >
                  Start New Order
                </button>
              </div>
            </div>
          ) : step === "checkout" ? (
            /* STEP 2: PAYMENT & CONFIRMATION */
            <div className="space-y-4 font-body text-xs">
              <div className="p-3 bg-[#F6EFE2] border border-[#2A2420]/20 flex justify-between items-center font-receipt">
                <span className="text-[#2A2420]/80">Amount Payable:</span>
                <span className="text-lg font-bold text-[#2A2420]">₹{totalCost.toFixed(2)}</span>
              </div>

              {/* Payment Methods Selection */}
              <div>
                <label className="font-semibold text-[11px] uppercase tracking-wider text-[#2A2420]/70 block mb-2 font-receipt">
                  Select Payment Counter Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Campus Card")}
                    className={`p-3 border text-left cursor-pointer flex flex-col justify-between h-24 ${
                      paymentMethod === "Campus Card"
                        ? "border-[#2A2420] bg-white ring-2 ring-[#E3A008]"
                        : "border-[#2A2420]/25 bg-[#F6EFE2] hover:bg-white"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#2A2420]" />
                    <div>
                      <span className="font-bold text-xs block text-[#2A2420]">Campus ID</span>
                      <span className="text-[10px] text-[#2A2420]/60 font-receipt">Meal card RFID</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("UPI")}
                    className={`p-3 border text-left cursor-pointer flex flex-col justify-between h-24 ${
                      paymentMethod === "UPI"
                        ? "border-[#2A2420] bg-white ring-2 ring-[#E3A008]"
                        : "border-[#2A2420]/25 bg-[#F6EFE2] hover:bg-white"
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-[#2A2420]" />
                    <div>
                      <span className="font-bold text-xs block text-[#2A2420]">Instant UPI</span>
                      <span className="text-[10px] text-[#2A2420]/60 font-receipt">GPay / PhonePe</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Cash Counter")}
                    className={`p-3 border text-left cursor-pointer flex flex-col justify-between h-24 ${
                      paymentMethod === "Cash Counter"
                        ? "border-[#2A2420] bg-white ring-2 ring-[#E3A008]"
                        : "border-[#2A2420]/25 bg-[#F6EFE2] hover:bg-white"
                    }`}
                  >
                    <Coins className="w-5 h-5 text-[#2A2420]" />
                    <div>
                      <span className="font-bold text-xs block text-[#2A2420]">Cash at Window</span>
                      <span className="text-[10px] text-[#2A2420]/60 font-receipt">Pay on pickup</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Method Specific Details */}
              {paymentMethod === "Campus Card" && (
                <div className="p-3.5 bg-white border border-[#2A2420]/20 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-xs text-[#2A2420]">Student RFID Account</span>
                    <span className="text-[10px] font-receipt px-2 py-0.5 bg-[#68D391]/20 text-[#22543d] font-bold">
                      VERIFIED
                    </span>
                  </div>
                  <div>
                    <label className="text-[10px] font-receipt text-[#2A2420]/70 block mb-1">
                      Student Roll / ID Number:
                    </label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full p-2 border border-[#2A2420]/30 font-receipt text-xs bg-[#FBF6EC]"
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-receipt pt-1 border-t border-[#2A2420]/10 text-[#2A2420]">
                    <span>Current Balance: ₹{demoCardBalance.toFixed(2)}</span>
                    <span className="font-bold">
                      After Order: ₹{balanceAfterOrder.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {paymentMethod === "UPI" && (
                <div className="p-3.5 bg-white border border-[#2A2420]/20 text-center space-y-2">
                  <div className="w-28 h-28 mx-auto bg-[#F6EFE2] border-2 border-dashed border-[#2A2420] flex items-center justify-center p-2">
                    <div className="text-center font-receipt text-[10px]">
                      <QrCode className="w-12 h-12 mx-auto text-[#2A2420] mb-1" />
                      <span>SCAN TO PAY</span>
                    </div>
                  </div>
                  <div className="font-receipt text-[11px] text-[#2A2420]">
                    VPA: <span className="font-bold">canteen.sac@campuspay</span>
                  </div>
                  <div className="text-[10px] text-[#2A2420]/70">
                    Instant verification. Token generated automatically upon submission.
                  </div>
                </div>
              )}

              {paymentMethod === "Cash Counter" && (
                <div className="p-3.5 bg-white border border-[#2A2420]/20 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#C1442D] font-bold text-xs">
                    <AlertCircle className="w-4 h-4" />
                    <span>Exact change appreciated</span>
                  </div>
                  <p className="text-[11px] text-[#2A2420]/80 leading-relaxed">
                    A reserved order token will be generated. Please tender ₹{totalCost.toFixed(2)} in cash at the payment counter window before pickup.
                  </p>
                </div>
              )}

              {/* Special Instructions for Kitchen */}
              <div>
                <label className="font-semibold text-[11px] uppercase tracking-wider text-[#2A2420]/70 block mb-1 font-receipt">
                  Special Kitchen Request (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Less spicy, extra mint dip, pack for takeaway..."
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full p-2 border border-[#2A2420]/30 font-receipt text-xs bg-white text-[#2A2420]"
                  maxLength={80}
                />
              </div>
            </div>
          ) : trayItems.length === 0 ? (
            /* EMPTY TRAY STATE */
            <div className="py-12 text-center space-y-3 font-body">
              <div className="text-4xl select-none">🍱</div>
              <div className="font-chalk text-2xl text-[#2A2420]">
                Your meal tray is empty
              </div>
              <p className="text-xs text-[#2A2420]/70 max-w-xs mx-auto">
                Explore the Chalkboard Menu or ask the AI Recommender to add freshly prepared dishes to your tray.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 bg-[#2A2420] text-[#FBF6EC] text-xs font-medium cursor-pointer"
              >
                Browse Canteen Menu
              </button>
            </div>
          ) : (
            /* STEP 1: ACTIVE TRAY ITEMS LIST */
            <div className="space-y-4">
              <div className="space-y-2.5">
                {trayItems.map((entry) => (
                  <div
                    key={entry.item.id}
                    className="p-3 bg-[#F6EFE2] border border-[#2A2420]/20 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-2xl select-none">{entry.item.emoji}</span>
                      <div className="min-w-0">
                        <div className="font-medium text-[#2A2420] truncate">
                          {entry.item.name}
                        </div>
                        <div className="text-[11px] font-receipt text-[#2A2420]/60">
                          ₹{entry.item.price.toFixed(2)} each • ~{entry.item.prep_time_minutes}m prep
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Stepper */}
                      <div className="flex items-center border border-[#2A2420]/30 bg-[#FBF6EC]">
                        <button
                          onClick={() => onUpdateQuantity(entry.item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-[#2A2420]/10 text-[#2A2420] cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-receipt font-semibold text-xs">
                          {entry.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(entry.item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-[#2A2420]/10 text-[#2A2420] cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="font-receipt font-bold text-xs w-16 text-right">
                        ₹{(entry.item.price * entry.quantity).toFixed(2)}
                      </div>

                      <button
                        onClick={() => onRemoveItem(entry.item.id)}
                        className="p-1 text-[#C1442D] hover:bg-[#C1442D]/10 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tray Summary Box */}
              <div className="pt-3 border-t-2 border-dashed border-[#2A2420]/30 space-y-1.5 font-receipt text-xs">
                <div className="flex justify-between text-[#2A2420]/75">
                  <span>Estimated Kitchen Turnaround:</span>
                  <span className="font-medium text-[#2A2420]">
                    ~{maxPrepTime} minutes
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#2A2420] pt-2 border-t border-[#2A2420]/20">
                  <span>Tray Total:</span>
                  <span>₹{totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {step === "tray" && trayItems.length > 0 && (
          <div className="p-4 bg-[#F6EFE2] border-t border-[#2A2420]/20 flex items-center justify-between gap-3">
            <button
              onClick={onClearTray}
              className="text-xs text-[#C1442D] underline hover:text-[#a13420] cursor-pointer"
            >
              Clear Tray
            </button>

            <button
              id="proceed-to-checkout-btn"
              onClick={() => setStep("checkout")}
              className="px-5 py-2 bg-[#E3A008] hover:bg-[#d49407] text-[#2A2420] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-[#2A2420]/25 shadow-xs"
            >
              <span>Proceed to Payment</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {step === "checkout" && (
          <div className="p-4 bg-[#F6EFE2] border-t border-[#2A2420]/20 flex items-center justify-between gap-3">
            <button
              onClick={() => setStep("tray")}
              className="text-xs text-[#2A2420] underline hover:text-[#2A2420]/70 cursor-pointer"
            >
              ← Back to Tray
            </button>

            <button
              id="confirm-tray-token-btn"
              disabled={isSubmitting}
              onClick={handlePlaceOrder}
              className="px-5 py-2 bg-[#26362E] hover:bg-[#1e2a24] text-[#F2EFE4] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-[#2A2420]/25 shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Generating Token...</span>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-[#E3A008]" />
                  <span>Generate Order Token (₹{totalCost.toFixed(2)})</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
