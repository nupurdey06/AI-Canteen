import React from "react";
import { Code2, ShoppingBag, Utensils, Sparkles, Clock, MapPin } from "lucide-react";

interface CanteenNavbarProps {
  trayCount: number;
  trayTotal: number;
  activeOrderCount?: number;
  onOpenTray: () => void;
  onOpenCodeModal: () => void;
  onOpenOrders?: () => void;
}

export const CanteenNavbar: React.FC<CanteenNavbarProps> = ({
  trayCount,
  trayTotal,
  activeOrderCount = 0,
  onOpenTray,
  onOpenCodeModal,
  onOpenOrders,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#26362E] text-[#F2EFE4] border-b border-[#F2EFE4]/20 shadow-md font-body">
      {/* Top micro-announcement bar */}
      <div className="bg-[#1f2c25] border-b border-[#F2EFE4]/10 px-4 py-1 text-[11px] font-receipt flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#F2EFE4]/80">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>CAMPUS CENTRAL CANTEEN • SERVING WINDOWS 1 & 2 OPEN</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[#F2EFE4]/70">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#E3A008]" /> Lunch: 11:30 AM – 3:30 PM
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#E3A008]" /> Student Union Block • Ground Floor
          </span>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand & Canteen Title */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 border border-[#F2EFE4]/30 bg-[#202d26] flex items-center justify-center text-xl shadow-xs group-hover:border-[#E3A008] transition">
            🍱
          </div>
          <div>
            <div className="font-chalk text-2xl sm:text-3xl tracking-wide leading-none text-[#F2EFE4] group-hover:text-[#E3A008] transition">
              Campus Canteen
            </div>
            <div className="text-[10px] font-receipt text-[#F2EFE4]/70 uppercase tracking-wider">
              Student Dining & AI Combo Counter
            </div>
          </div>
        </a>

        {/* Navigation Page Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
          <a
            href="#specials"
            className="text-[#F2EFE4]/80 hover:text-[#E3A008] transition flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E3A008]" />
            <span>Today's Specials</span>
          </a>
          <a
            href="#menu-board"
            className="text-[#F2EFE4]/80 hover:text-[#E3A008] transition flex items-center gap-1"
          >
            <Utensils className="w-3.5 h-3.5 text-[#E3A008]" />
            <span>Chalkboard Menu</span>
          </a>
          <a
            href="#recommender"
            className="text-[#F2EFE4]/80 hover:text-[#E3A008] transition flex items-center gap-1"
          >
            <span className="text-amber-400">✨</span>
            <span>AI Combo Desk</span>
          </a>
          <a
            href="#info"
            className="text-[#F2EFE4]/80 hover:text-[#E3A008] transition"
          >
            Timings & Info
          </a>
        </nav>

        {/* Action Buttons: Python Code & Student Tray */}
        <div className="flex items-center gap-2.5">
          <button
            id="nav-code-modal-btn"
            onClick={onOpenCodeModal}
            className="px-2.5 py-1.5 border border-[#F2EFE4]/30 bg-[#202d26] text-[#F2EFE4] hover:bg-[#1a251f] text-xs font-receipt flex items-center gap-1.5 transition cursor-pointer"
            title="View Python Streamlit app.py source"
          >
            <Code2 className="w-3.5 h-3.5 text-[#E3A008]" />
            <span className="hidden sm:inline">Python</span>
            <span className="text-[10px] text-[#E3A008]">app.py</span>
          </button>

          {activeOrderCount > 0 && onOpenOrders && (
            <button
              id="nav-orders-btn"
              onClick={onOpenOrders}
              className="px-2.5 py-1.5 bg-[#26362E] border border-[#E3A008] text-[#E3A008] hover:bg-[#1f2c25] text-xs font-receipt flex items-center gap-1.5 transition cursor-pointer"
              title="View your active canteen orders"
            >
              <span className="w-2 h-2 rounded-full bg-[#E3A008] animate-ping" />
              <span>Tokens: {activeOrderCount}</span>
            </button>
          )}

          <button
            id="nav-tray-btn"
            onClick={onOpenTray}
            className="px-3 py-1.5 bg-[#E3A008] text-[#2A2420] hover:bg-[#d49407] font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer border border-[#2A2420]/25 shadow-xs"
            aria-label="View Student Tray"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Tray</span>
            <span className="font-receipt font-bold bg-[#2A2420] text-[#F2EFE4] text-[10px] px-1.5 py-0.2 rounded-xs">
              {trayCount}
            </span>
            {trayTotal > 0 && (
              <span className="hidden sm:inline font-receipt text-[11px] pl-1 border-l border-[#2A2420]/30">
                ₹{trayTotal.toFixed(0)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
