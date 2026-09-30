import React from "react";
import { Sparkles, UtensilsCrossed, Clock, ShieldCheck, ChevronDown } from "lucide-react";

interface HeroAnnouncementProps {
  availableItemCount: number;
  totalItemCount: number;
  onScrollToRecommender: () => void;
  onScrollToMenu: () => void;
}

export const HeroAnnouncement: React.FC<HeroAnnouncementProps> = ({
  availableItemCount,
  totalItemCount,
  onScrollToRecommender,
  onScrollToMenu,
}) => {
  return (
    <section className="chalkboard-bg text-[#F2EFE4] border-b border-[#F2EFE4]/20 py-10 sm:py-14 px-4 sm:px-6 relative overflow-hidden font-body">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 border border-[#F2EFE4]/25 bg-[#202d26] px-3 py-1 text-xs font-receipt text-[#E3A008]">
              <span className="w-2 h-2 rounded-full bg-[#E3A008] inline-block animate-ping"></span>
              <span>DAILY CAMPUS FOOD SERVICE • LIVE KITCHEN</span>
            </div>

            <h1 className="font-chalk text-4xl sm:text-5xl lg:text-6xl text-[#F2EFE4] leading-[1.05] tracking-wide">
              Fresh, budget-friendly meals for busy campus days.
            </h1>

            <p className="text-sm sm:text-base text-[#F2EFE4]/80 max-w-xl leading-relaxed">
              Between lab sessions, back-to-back lectures, and exam revision, find wholesome food
              that fits your pocket and your break time. Ask our AI counter assistant for instant
              smart combos or order straight from the board.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-ask-ai-btn"
                onClick={onScrollToRecommender}
                className="px-5 py-3 bg-[#E3A008] text-[#2A2420] hover:bg-[#d49407] font-semibold text-sm flex items-center gap-2 transition cursor-pointer border border-[#2A2420]/25 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-[#2A2420]" />
                <span>Ask AI Meal Recommender</span>
              </button>

              <button
                id="hero-view-menu-btn"
                onClick={onScrollToMenu}
                className="px-5 py-3 border border-[#F2EFE4]/35 bg-[#202d26] text-[#F2EFE4] hover:bg-[#1a251f] font-medium text-sm flex items-center gap-2 transition cursor-pointer"
              >
                <UtensilsCrossed className="w-4 h-4 text-[#E3A008]" />
                <span>Browse Chalkboard Menu</span>
              </button>
            </div>

            {/* Live Counter Stats Bar */}
            <div className="pt-4 border-t border-[#F2EFE4]/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-receipt">
              <div>
                <div className="text-[#E3A008] text-base font-bold">
                  {availableItemCount}/{totalItemCount}
                </div>
                <div className="text-[#F2EFE4]/70 text-[11px]">Dishes in stock</div>
              </div>
              <div>
                <div className="text-[#E3A008] text-base font-bold">3–15 min</div>
                <div className="text-[#F2EFE4]/70 text-[11px]">Average prep wait</div>
              </div>
              <div>
                <div className="text-[#E3A008] text-base font-bold">₹25</div>
                <div className="text-[#F2EFE4]/70 text-[11px]">Combos start at</div>
              </div>
              <div>
                <div className="text-emerald-400 text-base font-bold">UPI / ID Card</div>
                <div className="text-[#F2EFE4]/70 text-[11px]">Instant checkout</div>
              </div>
            </div>
          </div>

          {/* Right Column: Physical Canteen Notice Board Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#1e2a23] border-2 border-[#F2EFE4]/30 p-5 sm:p-6 shadow-xl relative">
              {/* Board Header Pin */}
              <div className="flex items-center justify-between pb-3 border-b border-dashed border-[#F2EFE4]/25">
                <div className="font-chalk text-2xl text-[#E3A008]">
                  Kitchen Bulletin Board
                </div>
                <span className="rubber-stamp text-[9px] border-[#F2EFE4]/40 text-[#F2EFE4]/80">
                  Today's shift
                </span>
              </div>

              {/* Announcements list */}
              <div className="space-y-3.5 py-4 text-xs text-[#F2EFE4]/90">
                <div className="flex items-start gap-2.5">
                  <span className="text-[#E3A008] text-sm">📢</span>
                  <div>
                    <span className="font-semibold text-[#F2EFE4] block">Hot Counter 1:</span>
                    Fresh batch of South Indian Dosa & Parathas ready right now.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[#E3A008] text-sm">⚡</span>
                  <div>
                    <span className="font-semibold text-[#F2EFE4] block">Express Window 2:</span>
                    Quick tea, coffee, samosas & puffs served in under 4 minutes.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-[#E3A008] text-sm">🌱</span>
                  <div>
                    <span className="font-semibold text-[#F2EFE4] block">Dietary Friendly:</span>
                    100% vegetarian kitchen with dedicated Vegan and Halal certified options.
                  </div>
                </div>
              </div>

              {/* Bottom tag */}
              <div className="pt-3 border-t border-dashed border-[#F2EFE4]/20 flex items-center justify-between text-[11px] font-receipt text-[#F2EFE4]/70">
                <span>Student Union Dining • SAC-GF</span>
                <span className="text-[#E3A008]">Tokens 100–300</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
