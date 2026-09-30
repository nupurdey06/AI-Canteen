import React from "react";
import { MenuItem } from "../types";
import { X, Clock, Flame, ShieldAlert, Heart, Plus, Sparkles, Check } from "lucide-react";

interface DishDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToTray: (item: MenuItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (itemId: string) => void;
  onAskAIAboutDish: (item: MenuItem) => void;
  isInTray?: boolean;
  trayQuantity?: number;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({
  item,
  onClose,
  onAddToTray,
  isFavorite,
  onToggleFavorite,
  onAskAIAboutDish,
  isInTray = false,
  trayQuantity = 0,
}) => {
  if (!item) return null;

  // Derive nutritional estimations based on calories & ingredients
  const calories = item.calories || 350;
  const estProtein = Math.round(calories * 0.05); // ~15-30g
  const estCarbs = Math.round(calories * 0.12); // ~40-60g
  const estFat = Math.round(calories * 0.04); // ~10-20g

  // Determine allergens
  const allergens: string[] = [];
  const lowerName = (item.name + " " + item.ingredients.join(" ")).toLowerCase();
  if (lowerName.includes("wheat") || lowerName.includes("bun") || lowerName.includes("noodle") || lowerName.includes("pastry") || lowerName.includes("bread") || lowerName.includes("wrap")) {
    allergens.push("Gluten / Wheat");
  }
  if (lowerName.includes("paneer") || lowerName.includes("cheese") || lowerName.includes("milk") || lowerName.includes("dairy") || lowerName.includes("butter") || lowerName.includes("coffee")) {
    allergens.push("Dairy");
  }
  if (lowerName.includes("egg")) {
    allergens.push("Eggs");
  }
  if (lowerName.includes("sesame") || lowerName.includes("tahini")) {
    allergens.push("Sesame");
  }
  if (lowerName.includes("chickpea") || lowerName.includes("tofu") || lowerName.includes("edamame")) {
    allergens.push("Soy / Legumes");
  }

  // Determine spice level indicator (1 to 3 chilis)
  const isSpicy = lowerName.includes("spicy") || lowerName.includes("masala") || lowerName.includes("szechuan") || lowerName.includes("chili") || lowerName.includes("peri-peri");
  const spiceRating = isSpicy ? (lowerName.includes("szechuan") || lowerName.includes("peri-peri") ? 3 : 2) : 1;

  return (
    <div
      id="dish-detail-backdrop"
      className="fixed inset-0 z-50 bg-[#1b2520]/80 backdrop-blur-xs flex items-center justify-center p-4 font-body"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="dish-detail-card"
        className="bg-[#FBF6EC] border-2 border-[#2A2420] text-[#2A2420] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header styling like an old-school canteen recipe card */}
        <div className="p-4 sm:p-5 bg-[#26362E] text-[#F2EFE4] flex items-center justify-between border-b-2 border-[#2A2420]">
          <div className="flex items-center gap-3">
            <span className="text-3xl select-none">{item.emoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-receipt px-2 py-0.5 bg-[#E3A008] text-[#2A2420] font-bold">
                  {item.category}
                </span>
                {!item.is_available && (
                  <span className="text-[10px] uppercase font-receipt px-2 py-0.5 bg-[#C1442D] text-[#F2EFE4] font-bold">
                    Sold Out
                  </span>
                )}
              </div>
              <h3 className="font-chalk text-2xl leading-tight text-[#F2EFE4] mt-0.5">
                {item.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(item.id)}
              className="p-1.5 rounded-full hover:bg-white/10 text-[#F2EFE4] transition cursor-pointer"
              aria-label={isFavorite ? "Remove favorite" : "Add to favorites"}
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? "fill-[#C1442D] text-[#C1442D]" : "text-[#F2EFE4]"}`}
              />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-[#F2EFE4]/80 hover:text-[#F2EFE4] transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs font-body">
          {/* Price & Prep stats ribbon */}
          <div className="flex items-center justify-between p-3 bg-[#F6EFE2] border border-[#2A2420]/20 font-receipt">
            <div>
              <span className="text-[11px] text-[#2A2420]/70 block">Counter Price</span>
              <span className="text-xl font-bold text-[#2A2420]">₹{item.price.toFixed(2)}</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#2A2420]/70 flex items-center justify-end gap-1">
                <Clock className="w-3 h-3 text-[#E3A008]" /> Turnaround Time
              </span>
              <span className="text-base font-bold text-[#2A2420]">
                ~{item.prep_time_minutes} minutes
              </span>
            </div>
          </div>

          {/* Dietary tags */}
          <div>
            <span className="font-semibold text-[11px] uppercase tracking-wider text-[#2A2420]/70 block mb-1.5 font-receipt">
              Dietary Certification
            </span>
            <div className="flex flex-wrap gap-1.5">
              {item.dietary_tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 border border-[#2A2420]/30 bg-white font-receipt text-[11px] text-[#2A2420]"
                >
                  ✓ {tag}
                </span>
              ))}
              <span className="px-2 py-0.5 border border-[#2A2420]/30 bg-white font-receipt text-[11px] text-[#2A2420] flex items-center gap-1">
                <Flame className="w-3 h-3 text-[#C1442D]" />
                Spice: {"🌶️".repeat(spiceRating)}
              </span>
            </div>
          </div>

          {/* Ingredients list */}
          <div>
            <span className="font-semibold text-[11px] uppercase tracking-wider text-[#2A2420]/70 block mb-1.5 font-receipt">
              Kitchen Ingredients
            </span>
            <div className="p-3 bg-white border border-[#2A2420]/20 space-y-1">
              <ul className="list-disc list-inside space-y-1 text-[#2A2420]">
                {item.ingredients.map((ing, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Nutrition Info Cards */}
          <div>
            <span className="font-semibold text-[11px] uppercase tracking-wider text-[#2A2420]/70 block mb-1.5 font-receipt">
              Nutritional Profile (Approx.)
            </span>
            <div className="grid grid-cols-4 gap-2 text-center font-receipt">
              <div className="p-2 bg-[#F6EFE2] border border-[#2A2420]/20">
                <span className="text-[10px] text-[#2A2420]/70 block">Calories</span>
                <span className="text-sm font-bold text-[#2A2420]">{calories}</span>
                <span className="text-[9px] text-[#2A2420]/60 block">kcal</span>
              </div>
              <div className="p-2 bg-[#F6EFE2] border border-[#2A2420]/20">
                <span className="text-[10px] text-[#2A2420]/70 block">Protein</span>
                <span className="text-sm font-bold text-[#2A2420]">{estProtein}g</span>
                <span className="text-[9px] text-[#2A2420]/60 block">muscle fuel</span>
              </div>
              <div className="p-2 bg-[#F6EFE2] border border-[#2A2420]/20">
                <span className="text-[10px] text-[#2A2420]/70 block">Carbs</span>
                <span className="text-sm font-bold text-[#2A2420]">{estCarbs}g</span>
                <span className="text-[9px] text-[#2A2420]/60 block">study energy</span>
              </div>
              <div className="p-2 bg-[#F6EFE2] border border-[#2A2420]/20">
                <span className="text-[10px] text-[#2A2420]/70 block">Fats</span>
                <span className="text-sm font-bold text-[#2A2420]">{estFat}g</span>
                <span className="text-[9px] text-[#2A2420]/60 block">healthy oils</span>
              </div>
            </div>
          </div>

          {/* Allergens warning */}
          {allergens.length > 0 && (
            <div className="p-2.5 bg-[#FFF3CD] border border-[#856404]/30 text-[#856404] flex items-start gap-2 text-[11px]">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Allergen Notice:</span> Contains{" "}
                {allergens.join(", ")}. Please notify canteen counter staff if you have severe sensitivities.
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-[#F6EFE2] border-t-2 border-[#2A2420] flex flex-wrap items-center justify-between gap-2.5">
          <button
            onClick={() => {
              onAskAIAboutDish(item);
              onClose();
            }}
            className="px-3 py-2 border border-[#2A2420]/40 hover:bg-[#2A2420]/5 text-[#2A2420] text-xs font-medium flex items-center gap-1.5 cursor-pointer font-receipt"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E3A008]" />
            Ask AI: Build combo with this
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (item.is_available) {
                  onAddToTray(item);
                }
              }}
              disabled={!item.is_available}
              className={`px-5 py-2 text-xs font-semibold flex items-center gap-1.5 transition border border-[#2A2420]/30 shadow-xs cursor-pointer ${
                !item.is_available
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400"
                  : isInTray
                  ? "bg-[#26362E] text-[#F2EFE4] hover:bg-[#1f2c25]"
                  : "bg-[#E3A008] hover:bg-[#d49407] text-[#2A2420]"
              }`}
            >
              {isInTray ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  In Tray ({trayQuantity}) • Add Another
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  Add to Tray • ₹{item.price.toFixed(2)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
