import React from "react";
import { Code2, ArrowUp } from "lucide-react";

interface CanteenFooterProps {
  onOpenCodeModal: () => void;
}

export const CanteenFooter: React.FC<CanteenFooterProps> = ({ onOpenCodeModal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#1e2a23] text-[#F2EFE4] border-t border-[#F2EFE4]/20 py-10 px-4 sm:px-6 font-body">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#F2EFE4]/15">
          <div className="space-y-1">
            <div className="font-chalk text-3xl text-[#F2EFE4] tracking-wide">
              Campus Central Canteen
            </div>
            <p className="text-xs text-[#F2EFE4]/70 max-w-md font-receipt">
              University Dining Services • Daily meals, healthy combos & AI recommendation assistant.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCodeModal}
              className="px-3 py-1.5 border border-[#F2EFE4]/30 bg-[#26362E] text-[#F2EFE4] hover:bg-[#1a251f] text-xs font-receipt flex items-center gap-1.5 transition cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5 text-[#E3A008]" />
              <span>Python app.py</span>
            </button>

            <button
              onClick={scrollToTop}
              className="px-3 py-1.5 border border-[#F2EFE4]/30 hover:bg-[#26362E] text-xs flex items-center gap-1 cursor-pointer"
              title="Back to top"
            >
              <span>Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-receipt text-[#F2EFE4]/60">
          <div>
            Student Canteen Recommendation Prototype • Powered by Gemini AI
          </div>
          <div>
            SAC Ground Floor • Open daily 8:00 AM – 10:30 PM
          </div>
        </div>
      </div>
    </footer>
  );
};
