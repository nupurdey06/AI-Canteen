import React from "react";
import { MenuItem } from "../types";
import { Sparkles, Clock, Plus, ArrowRight, Check } from "lucide-react";

interface SpecialCombo {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  itemIds: string[];
  totalPrice: number;
  totalPrepTime: number;
  tags: string[];
  description: string;
}

interface CampusSpecialsProps {
  menuItems: MenuItem[];
  onAddComboToTray: (items: MenuItem[]) => void;
  onAskAIWithCombo: (prompt: string, budget: number, time: number) => void;
}

export const CampusSpecials: React.FC<CampusSpecialsProps> = ({
  menuItems,
  onAddComboToTray,
  onAskAIWithCombo,
}) => {
  // Pre-configured popular campus combos mapped strictly to live menu items
  const specials: SpecialCombo[] = [
    {
      id: "special_1",
      title: "Late Night Revision Fuel",
      subtitle: "Quick alertness & rich cocoa bite",
      emoji: "☕",
      itemIds: ["item_12", "item_16"], // Iced Vanilla Oat Latte + Double Chocolate Fudge Brownie
      totalPrice: 90.0,
      totalPrepTime: 3,
      tags: ["Vegetarian", "Quick 3m"],
      description: "Espresso with Madagascar vanilla and rich Belgian chocolate fudge brownie to recharge during study sprints.",
    },
    {
      id: "special_2",
      title: "Canteen Street Craving",
      subtitle: "Crispy, savory & fizzy refresher",
      emoji: "🍟",
      itemIds: ["item_08", "item_09", "item_14"], // Crispy Masala Fries + Steamed Veggie Dumplings + Sparkling Mint Lemonade
      totalPrice: 140.0,
      totalPrepTime: 7,
      tags: ["Vegan", "Campus Hit"],
      description: "Peri-peri masala fries, steamed veggie dumplings with soy dip, and a chilled sparkling mint lemonade.",
    },
    {
      id: "special_3",
      title: "North Campus Lunch Bowl",
      subtitle: "High protein & filling midday meal",
      emoji: "🍛",
      itemIds: ["item_01", "item_14"], // Paneer Tikka Rice Bowl + Sparkling Mint Lemonade
      totalPrice: 155.0,
      totalPrepTime: 10,
      tags: ["Gluten-Free", "Halal"],
      description: "Spiced basmati rice with grilled cottage cheese gravy and an iced fizzy spearmint lemonade refresher.",
    },
    {
      id: "special_4",
      title: "Clean Plant Energy Combo",
      subtitle: "100% plant-based & revitalizing",
      emoji: "🌯",
      itemIds: ["item_02", "item_18"], // Crispy Falafel Wrap + Fruit Medley Bowl
      totalPrice: 130.0,
      totalPrepTime: 7,
      tags: ["Vegan", "Clean Fuel"],
      description: "Crunchy chickpea patties in warm flatbread with tahini drizzle plus a fresh watermelon and blueberry fruit bowl.",
    },
  ];

  const handleOrderCombo = (combo: SpecialCombo) => {
    const matchedItems = combo.itemIds
      .map((id) => menuItems.find((m) => m.id === id))
      .filter((m): m is MenuItem => m !== undefined && m.is_available);

    if (matchedItems.length > 0) {
      onAddComboToTray(matchedItems);
    }
  };

  const handleAskAI = (combo: SpecialCombo) => {
    const prompt = `I'd like a meal combo inspired by the "${combo.title}" (${combo.description}) within ₹${combo.totalPrice} and under ${combo.totalPrepTime + 2} minutes.`;
    onAskAIWithCombo(prompt, combo.totalPrice + 15, combo.totalPrepTime + 2);
  };

  return (
    <section id="specials" className="py-12 bg-[#F6EFE2] text-[#2A2420] border-b border-[#2A2420]/20 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#2A2420]/15 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-receipt text-[#C1442D] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Specials</span>
            </div>
            <h2 className="font-chalk text-3xl sm:text-4xl text-[#2A2420]">
              Today's Chef Combos & Counter Hits
            </h2>
          </div>
          <p className="text-xs text-[#2A2420]/75 max-w-sm">
            Hand-picked combinations tested for turnaround speed, taste, and student budget value. Ready in under 10 minutes.
          </p>
        </div>

        {/* Combos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {specials.map((combo) => {
            const comboItems = combo.itemIds
              .map((id) => menuItems.find((m) => m.id === id))
              .filter((m): m is MenuItem => m !== undefined);

            const allAvailable = comboItems.every((i) => i.is_available);

            return (
              <div
                key={combo.id}
                className="bg-[#FBF6EC] border border-[#2A2420]/25 p-5 flex flex-col justify-between shadow-xs hover:border-[#2A2420] transition group relative"
              >
                <div>
                  {/* Top Badge & Emoji */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-3xl">{combo.emoji}</span>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {combo.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rubber-stamp text-[9px] border-[#2A2420]/40 text-[#2A2420]/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Combo Title */}
                  <h3 className="font-chalk text-2xl text-[#2A2420] group-hover:text-[#C1442D] transition leading-tight">
                    {combo.title}
                  </h3>
                  <div className="text-[11px] font-receipt text-[#2A2420]/60 mb-2">
                    {combo.subtitle}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#2A2420]/80 leading-relaxed mb-4">
                    {combo.description}
                  </p>

                  {/* Items included */}
                  <div className="border-t border-dashed border-[#2A2420]/20 pt-2.5 space-y-1 mb-4">
                    <div className="text-[10px] font-receipt uppercase text-[#2A2420]/60">
                      Dishes in combo:
                    </div>
                    {comboItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-xs text-[#2A2420]/90"
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <span>{item.emoji}</span>
                          <span className={`truncate ${!item.is_available ? "line-through text-gray-400" : ""}`}>
                            {item.name}
                          </span>
                        </span>
                        <span className="font-receipt text-[11px] shrink-0">
                          ₹{item.price.toFixed(0)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Pricing & Action Buttons */}
                <div className="border-t border-[#2A2420]/20 pt-3 space-y-2">
                  <div className="flex items-center justify-between font-receipt">
                    <div className="flex items-center gap-1 text-xs text-[#2A2420]/75">
                      <Clock className="w-3.5 h-3.5 text-[#E3A008]" />
                      <span>{combo.totalPrepTime} mins</span>
                    </div>
                    <div className="text-lg font-bold text-[#2A2420]">
                      ₹{combo.totalPrice.toFixed(0)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleOrderCombo(combo)}
                      disabled={!allAvailable}
                      className="w-full py-1.5 px-2 bg-[#E3A008] hover:bg-[#d49407] text-[#2A2420] text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-[#2A2420]/20"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Tray</span>
                    </button>

                    <button
                      onClick={() => handleAskAI(combo)}
                      className="w-full py-1.5 px-2 border border-[#2A2420]/30 hover:bg-[#2A2420]/5 text-[#2A2420] text-xs font-medium flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <span>Customize</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
