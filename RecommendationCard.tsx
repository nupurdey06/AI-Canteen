import React from "react";
import { MenuItem, RecommendationResult } from "../types";
import { motion } from "motion/react";

interface RecommendationCardProps {
  data: RecommendationResult;
  allItems: MenuItem[];
  budgetLimit: number;
  maxPrepTime: number;
  onAddComboToTray?: (items: MenuItem[]) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  data,
  allItems,
  budgetLimit,
  maxPrepTime,
  onAddComboToTray,
}) => {
  const itemsMap = new Map<string, MenuItem>(allItems.map((i) => [i.id, i]));

  const recommendedItems = (data.recommended_combination || [])
    .map((id) => itemsMap.get(id))
    .filter((item): item is MenuItem => Boolean(item));

  const alternativeItems = (data.alternatives || [])
    .map((id) => itemsMap.get(id))
    .filter((item): item is MenuItem => Boolean(item));

  const isUnderBudget = data.total_cost <= budgetLimit;
  const isUnderTime = data.total_prep_time <= maxPrepTime;
  const budgetDiff = budgetLimit - data.total_cost;

  return (
    <motion.div
      id="gemini-recommendation-ticket"
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mt-3 bg-[#FBF6EC] text-[#2A2420] border-x border-[#2A2420]/20 p-5 shadow-md font-body max-w-lg mx-auto relative receipt-tear-top receipt-tear-bottom"
    >
      {/* Receipt Header */}
      <div className="text-center pb-3 border-b border-dashed border-[#2A2420]/30 space-y-1">
        <div className="font-chalk text-2xl tracking-wide text-[#2A2420]">
          Campus Canteen Token
        </div>
        <div className="font-receipt text-[11px] text-[#2A2420]/75 tracking-wider">
          ORDER SLIP • TOKEN #{Math.floor(1000 + (data.total_cost * 7) % 9000)}
        </div>
        <div className="font-receipt text-[10px] text-[#2A2420]/60">
          Recommendation based on student preferences
        </div>
      </div>

      {/* Counter Note (AI Explanation) */}
      <div className="py-3 border-b border-dashed border-[#2A2420]/20 text-xs text-[#2A2420]/90 leading-relaxed">
        <span className="font-semibold text-[#2A2420] block mb-0.5">
          Counter note:
        </span>
        <p className="italic">{data.explanation}</p>
      </div>

      {/* Itemized Receipt Table */}
      <div className="py-3 space-y-2.5">
        <div className="flex justify-between items-center text-[11px] font-receipt text-[#2A2420]/60 pb-1 border-b border-[#2A2420]/15">
          <span>Item & prep</span>
          <span>Amount</span>
        </div>

        {recommendedItems.length === 0 ? (
          <div className="text-xs text-[#C1442D] py-2">
            No specific combination found within current filters.
          </div>
        ) : (
          recommendedItems.map((item, idx) => (
            <div
              key={item.id}
              id={`ticket-item-${item.id}`}
              className="flex items-start justify-between gap-3 text-xs"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 font-medium text-[#2A2420]">
                  <span>{idx + 1}.</span>
                  <span>{item.emoji}</span>
                  <span className="truncate">{item.name}</span>
                </div>
                <div className="text-[11px] text-[#2A2420]/70 pl-4 space-x-1.5 mt-0.5">
                  <span className="font-receipt">{item.prep_time_minutes}m prep</span>
                  <span>•</span>
                  <span className="text-[10px] italic">{item.category}</span>
                </div>
                {item.dietary_tags.length > 0 && (
                  <div className="pl-4 flex flex-wrap gap-1 mt-1">
                    {item.dietary_tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rubber-stamp text-[9px] ${
                          tag.toLowerCase() === "spicy"
                            ? "rubber-stamp-chili"
                            : "border-[#2A2420]/40 text-[#2A2420]/80"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <span className="font-receipt font-semibold text-sm text-[#2A2420] shrink-0 pt-0.5">
                ₹{item.price.toFixed(2)}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Receipt Totals Section */}
      <div className="pt-3 border-t-2 border-dashed border-[#2A2420]/30 space-y-1.5 font-receipt text-xs">
        <div className="flex justify-between items-center text-[#2A2420]/80">
          <span>Items count:</span>
          <span>{recommendedItems.length}</span>
        </div>
        <div className="flex justify-between items-center text-[#2A2420]/80">
          <span>Est. wait time:</span>
          <span className={isUnderTime ? "text-[#2A2420]" : "text-[#C1442D] font-bold"}>
            {data.total_prep_time} mins (max {maxPrepTime}m)
          </span>
        </div>
        <div className="flex justify-between items-center text-[#2A2420]/80">
          <span>Student budget:</span>
          <span>₹{budgetLimit.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-sm font-bold text-[#2A2420] pt-1.5 border-t border-[#2A2420]/15">
          <span>Total payable:</span>
          <span className="text-base px-1 bg-[#E3A008]/20 border-b-2 border-[#E3A008]">
            ₹{data.total_cost.toFixed(2)}
          </span>
        </div>
        <div className="text-[10px] text-right text-[#2A2420]/70">
          {budgetDiff >= 0
            ? `Savings: ₹${budgetDiff.toFixed(2)} under budget`
            : `Exceeds budget by ₹${Math.abs(budgetDiff).toFixed(2)}`}
        </div>
      </div>

      {/* Alternative Options (Counter Substitutes) */}
      {alternativeItems.length > 0 && (
        <div className="mt-4 pt-3 border-t border-dashed border-[#2A2420]/25">
          <div className="text-[11px] font-semibold text-[#2A2420] mb-2 flex items-center justify-between">
            <span>Substitutes (if items sell out):</span>
            <span className="rubber-stamp text-[8px]">backup</span>
          </div>
          <div className="space-y-1.5">
            {alternativeItems.map((alt) => (
              <div
                key={alt.id}
                className="flex items-center justify-between text-xs py-1 border-b border-dotted border-[#2A2420]/15"
              >
                <div className="flex items-center gap-1.5 text-[#2A2420]/90">
                  <span>{alt.emoji}</span>
                  <span>{alt.name}</span>
                  <span className="font-receipt text-[10px] text-[#2A2420]/60">
                    ({alt.prep_time_minutes}m)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-receipt font-medium text-xs text-[#2A2420]">
                    ₹{alt.price.toFixed(2)}
                  </span>
                  {onAddComboToTray && (
                    <button
                      onClick={() => onAddComboToTray([alt])}
                      className="text-[10px] px-1.5 py-0.5 bg-[#E3A008] hover:bg-[#d49407] text-[#2A2420] font-bold cursor-pointer transition border border-[#2A2420]/20"
                      title="Add substitute to tray"
                    >
                      + Add
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Receipt Action Buttons */}
      <div className="mt-4 pt-3 border-t border-dashed border-[#2A2420]/30 grid grid-cols-2 gap-2">
        {onAddComboToTray && recommendedItems.length > 0 && (
          <button
            onClick={() => onAddComboToTray(recommendedItems)}
            className="py-2 px-3 bg-[#E3A008] hover:bg-[#d49407] text-[#2A2420] text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer border border-[#2A2420]/25 shadow-xs"
          >
            <span>Add Combo to Tray</span>
          </button>
        )}
        <button
          onClick={() => window.print()}
          className="py-2 px-3 border border-[#2A2420]/40 hover:bg-[#2A2420]/5 text-[#2A2420] text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <span>Print Token Slip</span>
        </button>
      </div>

      {/* Receipt Footer */}
      <div className="mt-3 pt-2 text-center font-receipt text-[10px] text-[#2A2420]/60 space-y-0.5">
        <div>Please show this slip at the canteen pick-up window</div>
        <div className="text-[9px]">Thank you • Have a great study session!</div>
      </div>
    </motion.div>
  );
};

